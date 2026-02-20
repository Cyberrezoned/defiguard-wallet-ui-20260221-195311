import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./ETHWallet.css";

const MARKET_REFRESH_MS = 30000;
const CHAIN_REFRESH_MS = 15000;

const truncate = (value, start = 6, end = 4) =>
  value ? `${value.slice(0, start)}...${value.slice(-end)}` : "";

const formatFiat = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const formatCompactFiat = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);

const formatPercent = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
};

const formatEthAmount = (value) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return "0";
  }
  return parsed.toFixed(6).replace(/\.?0+$/, "");
};

const toWei = (eth) => {
  const Web3 = window.Web3;
  if (!Web3) throw new Error('Web3 not loaded');
  return Web3.utils.toWei(eth.toString(), "ether");
};

const fromWei = (wei) => {
  const Web3 = window.Web3;
  if (!Web3) return '0.000000';
  return parseFloat(Web3.utils.fromWei(wei.toString(), "ether")).toFixed(6);
};

const isValidAddress = (address) => {
  try {
    if (!window.Web3) return false;
    return window.Web3.utils.isAddress(address);
  } catch {
    return false;
  }
};

const makeQRPattern = (address) => {
  const size = 13;
  const cells = [];
  const seed = (address || "0x0").replace("0x", "") || "0";

  for (let i = 0; i < size * size; i += 1) {
    const hex = parseInt(seed[i % seed.length], 16);
    const row = Math.floor(i / size);
    const col = i % size;
    const inFinder =
      (row < 4 && col < 4) ||
      (row < 4 && col > size - 5) ||
      (row > size - 5 && col < 4);
    cells.push(inFinder || hex > 7);
  }

  return cells;
};

const sparklineBars = (points, bars = 16) => {
  if (!Array.isArray(points) || points.length === 0) {
    return Array.from({ length: bars }, () => 50);
  }

  const step = Math.max(1, Math.floor(points.length / bars));
  const sampled = [];

  for (let i = 0; i < points.length && sampled.length < bars; i += step) {
    sampled.push(points[i]);
  }

  while (sampled.length < bars) {
    sampled.push(sampled[sampled.length - 1]);
  }

  const min = Math.min(...sampled);
  const max = Math.max(...sampled);

  if (min === max) {
    return sampled.map(() => 50);
  }

  return sampled.map((value) => {
    const ratio = (value - min) / (max - min);
    return Math.round(16 + ratio * 76);
  });
};

const getExplorerBase = (id) => {
  const map = {
    1: "https://etherscan.io",
    5: "https://goerli.etherscan.io",
    10: "https://optimistic.etherscan.io",
    56: "https://bscscan.com",
    137: "https://polygonscan.com",
    8453: "https://basescan.org",
    11155111: "https://sepolia.etherscan.io",
  };
  return map[id] || "https://etherscan.io";
};

const getNetworkName = (id) => {
  const map = {
    1: "Ethereum Mainnet",
    5: "Goerli",
    10: "Optimism",
    56: "BSC",
    137: "Polygon",
    8453: "Base",
    11155111: "Sepolia",
  };
  return map[id] || `Chain ${id}`;
};

const MARKET_ENDPOINT =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum,bitcoin,solana,avalanche-2&order=market_cap_desc&per_page=4&page=1&sparkline=true&price_change_percentage=24h";

const ETH_PRICE_ENDPOINT =
  "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true";

const GLOBAL_MARKET_ENDPOINT = "https://api.coingecko.com/api/v3/global";

export default function ETHWallet() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const [chainId, setChainId] = useState(null);

  const [tab, setTab] = useState("send");
  const [toAddr, setToAddr] = useState("");
  const [amount, setAmount] = useState("");

  const [txStatus, setTxStatus] = useState(null);
  const [isConnecting, setConnecting] = useState(false);
  const [isSending, setSending] = useState(false);
  const [txHistory, setTxHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [addrError, setAddrError] = useState(false);
  const [amtError, setAmtError] = useState(false);

  const [marketRows, setMarketRows] = useState([]);
  const [ethPriceUsd, setEthPriceUsd] = useState(null);
  const [ethPriceChange24h, setEthPriceChange24h] = useState(null);
  const [marketCapUsd, setMarketCapUsd] = useState(null);
  const [marketCapChange24h, setMarketCapChange24h] = useState(null);
  const [activeCoins, setActiveCoins] = useState(null);
  const [marketUpdatedAt, setMarketUpdatedAt] = useState(null);
  const [marketError, setMarketError] = useState("");

  const [chainTelemetry, setChainTelemetry] = useState({
    gasPriceGwei: null,
    latestBlock: null,
    nonce: null,
    updatedAt: null,
  });
  const [chainError, setChainError] = useState("");
  const seenTxHashesRef = useRef(new Set());
  const lastScannedBlockRef = useRef(null);

  const isConnected = Boolean(account);

  const numericBalance = useMemo(() => {
    if (balance === null || balance === undefined) {
      return 0;
    }

    const parsed = parseFloat(balance);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [balance]);

  const portfolioValueUsd = useMemo(() => {
    if (!ethPriceUsd || !isConnected) {
      return "$0.00";
    }
    return formatFiat(numericBalance * ethPriceUsd);
  }, [ethPriceUsd, numericBalance, isConnected]);

  const qrPattern = useMemo(() => makeQRPattern(account), [account]);

  const appendTxHistory = useCallback((entry) => {
    setTxHistory((prev) => {
      if (entry?.hash && prev.some((tx) => tx.hash === entry.hash)) {
        return prev;
      }
      return [entry, ...prev].slice(0, 100);
    });
  }, []);

  const loadChainTelemetry = useCallback(async (client = web3, walletAddress = account) => {
    if (!client || !walletAddress) {
      setChainTelemetry({ gasPriceGwei: null, latestBlock: null, nonce: null, updatedAt: null });
      return;
    }

    try {
      const [gasPriceWei, latestBlock, nonce] = await Promise.all([
        client.eth.getGasPrice(),
        client.eth.getBlockNumber(),
        client.eth.getTransactionCount(walletAddress, "pending"),
      ]);

      const gasPriceGwei = parseFloat(client.utils.fromWei(gasPriceWei, "gwei"));

      setChainTelemetry({
        gasPriceGwei: Number.isNaN(gasPriceGwei) ? null : gasPriceGwei.toFixed(2),
        latestBlock,
        nonce,
        updatedAt: Date.now(),
      });
      setChainError("");
    } catch {
      setChainError("Live chain telemetry is temporarily unavailable.");
    }
  }, [web3, account]);

  const loadMarketData = useCallback(async () => {
    try {
      const [marketResponse, ethResponse, globalResponse] = await Promise.all([
        fetch(MARKET_ENDPOINT),
        fetch(ETH_PRICE_ENDPOINT),
        fetch(GLOBAL_MARKET_ENDPOINT),
      ]);

      if (!marketResponse.ok || !ethResponse.ok || !globalResponse.ok) {
        throw new Error("Market API unavailable");
      }

      const [marketJson, ethJson, globalJson] = await Promise.all([
        marketResponse.json(),
        ethResponse.json(),
        globalResponse.json(),
      ]);

      const normalizedMarkets = (marketJson || []).map((item) => ({
        symbol: item.symbol?.toUpperCase() || "-",
        name: item.name || "Unknown",
        price: item.current_price ?? null,
        change24h:
          item.price_change_percentage_24h_in_currency ??
          item.price_change_percentage_24h ??
          null,
        spark: sparklineBars(item.sparkline_in_7d?.price || []),
      }));

      setMarketRows(normalizedMarkets);
      setEthPriceUsd(ethJson?.ethereum?.usd ?? null);
      setEthPriceChange24h(ethJson?.ethereum?.usd_24h_change ?? null);
      setMarketCapUsd(globalJson?.data?.total_market_cap?.usd ?? null);
      setMarketCapChange24h(globalJson?.data?.market_cap_change_percentage_24h_usd ?? null);
      setActiveCoins(globalJson?.data?.active_cryptocurrencies ?? null);
      setMarketUpdatedAt(Date.now());
      setMarketError("");
    } catch {
      setMarketError("Live market feed unavailable. Retrying automatically.");
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum || !window.Web3) {
      setTxStatus({
        type: "error",
        msg: "MetaMask not detected. Install MetaMask and refresh.",
      });
      return;
    }

    setConnecting(true);
    setTxStatus(null);

    try {
      const Web3 = window.Web3;
      const nextWeb3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

      if (!accounts || !accounts.length) {
        throw new Error("No accounts returned from wallet provider.");
      }

      const nextChainId = await nextWeb3.eth.getChainId();
      const nextBalance = await nextWeb3.eth.getBalance(accounts[0]);

      setWeb3(nextWeb3);
      setAccount(accounts[0]);
      setChainId(nextChainId);
      setNetwork(getNetworkName(nextChainId));
      setBalance(fromWei(nextBalance));
      seenTxHashesRef.current = new Set();
      lastScannedBlockRef.current = null;
      await loadChainTelemetry(nextWeb3, accounts[0]);
      setTxStatus({ type: "success", msg: "Wallet connected and synchronized." });
    } catch (error) {
      const denied = error?.message?.toLowerCase().includes("denied");
      setTxStatus({
        type: "error",
        msg: denied ? "Connection request was rejected." : error?.message || "Connection failed.",
      });
    } finally {
      setConnecting(false);
    }
  }, [loadChainTelemetry]);

  const disconnectWallet = useCallback(() => {
    setWeb3(null);
    setAccount(null);
    setBalance(null);
    setNetwork(null);
    setChainId(null);
    setTab("send");
    setToAddr("");
    setAmount("");
    setChainTelemetry({ gasPriceGwei: null, latestBlock: null, nonce: null, updatedAt: null });
    seenTxHashesRef.current = new Set();
    lastScannedBlockRef.current = null;
    setTxStatus({ type: "info", msg: "Wallet session cleared in app." });
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!web3 || !account) {
      return;
    }

    try {
      const nextBalance = await web3.eth.getBalance(account);
      setBalance(fromWei(nextBalance));
      await loadChainTelemetry();
    } catch {
      setTxStatus({ type: "error", msg: "Unable to refresh wallet balance." });
    }
  }, [web3, account, loadChainTelemetry]);

  const scanIncomingTransfers = useCallback(async () => {
    if (!web3 || !account) {
      return;
    }

    try {
      const latestBlock = await web3.eth.getBlockNumber();

      if (lastScannedBlockRef.current === null) {
        lastScannedBlockRef.current = Math.max(0, latestBlock - 20);
        return;
      }

      const fromBlock = Math.max(lastScannedBlockRef.current + 1, latestBlock - 20);
      if (fromBlock > latestBlock) {
        return;
      }

      let foundIncomingTransfer = false;
      const accountLower = account.toLowerCase();

      for (let blockNumber = fromBlock; blockNumber <= latestBlock; blockNumber += 1) {
        const block = await web3.eth.getBlock(blockNumber, true);
        const txs = block?.transactions || [];

        for (const tx of txs) {
          if (!tx?.to || !tx.hash || tx.to.toLowerCase() !== accountLower) {
            continue;
          }

          if (tx.from && tx.from.toLowerCase() === accountLower) {
            continue;
          }

          if (seenTxHashesRef.current.has(tx.hash)) {
            continue;
          }

          seenTxHashesRef.current.add(tx.hash);
          foundIncomingTransfer = true;

          appendTxHistory({
            type: "received",
            from: tx.from,
            amount: formatEthAmount(web3.utils.fromWei(tx.value || "0", "ether")),
            hash: tx.hash,
            time: new Date((Number(block.timestamp) || Date.now() / 1000) * 1000).toLocaleTimeString(),
            network: network || getNetworkName(chainId),
          });
        }
      }

      lastScannedBlockRef.current = latestBlock;

      if (foundIncomingTransfer) {
        const nextBalance = await web3.eth.getBalance(account);
        setBalance(fromWei(nextBalance));
      }
    } catch {
      // no-op: receiving monitor should not disrupt wallet operations
    }
  }, [web3, account, appendTxHistory, network, chainId]);

  useEffect(() => {
    loadMarketData();
    const timer = window.setInterval(loadMarketData, MARKET_REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [loadMarketData]);

  useEffect(() => {
    if (!window.ethereum || !window.Web3) {
      return undefined;
    }

    let isCancelled = false;

    const hydrateWallet = async () => {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        const existingAccount = accounts?.[0];
        if (!existingAccount || isCancelled) {
          return;
        }

        const Web3 = window.Web3;
        const nextWeb3 = new Web3(window.ethereum);
        const [nextChainId, nextBalance] = await Promise.all([
          nextWeb3.eth.getChainId(),
          nextWeb3.eth.getBalance(existingAccount),
        ]);

        if (isCancelled) {
          return;
        }

        setWeb3(nextWeb3);
        setAccount(existingAccount);
        setChainId(nextChainId);
        setNetwork(getNetworkName(nextChainId));
        setBalance(fromWei(nextBalance));
        seenTxHashesRef.current = new Set();
        lastScannedBlockRef.current = null;
        await loadChainTelemetry(nextWeb3, existingAccount);
      } catch {
        // ignore hydration failures and wait for explicit user connect
      }
    };

    hydrateWallet();
    return () => {
      isCancelled = true;
    };
  }, [loadChainTelemetry]);

  useEffect(() => {
    if (!isConnected) {
      return undefined;
    }

    const tick = async () => {
      await Promise.allSettled([loadChainTelemetry(), scanIncomingTransfers()]);
    };

    tick();
    const timer = window.setInterval(tick, CHAIN_REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [isConnected, loadChainTelemetry, scanIncomingTransfers]);

  useEffect(() => {
    if (!window.ethereum) {
      return undefined;
    }

    const handleAccounts = async (accounts) => {
      const nextAccount = accounts?.[0];
      if (!nextAccount) {
        setAccount(null);
        setBalance(null);
        setWeb3(null);
        setChainTelemetry({ gasPriceGwei: null, latestBlock: null, nonce: null, updatedAt: null });
        seenTxHashesRef.current = new Set();
        lastScannedBlockRef.current = null;
        setTxStatus({ type: "info", msg: "Wallet disconnected from provider." });
        return;
      }

      setAccount(nextAccount);
      seenTxHashesRef.current = new Set();
      lastScannedBlockRef.current = null;

      if (web3) {
        const nextBalance = await web3.eth.getBalance(nextAccount);
        setBalance(fromWei(nextBalance));
        await loadChainTelemetry(web3, nextAccount);
      }
    };

    const handleChain = async (rawChainId) => {
      const id =
        typeof rawChainId === "string" && rawChainId.startsWith("0x")
          ? parseInt(rawChainId, 16)
          : Number(rawChainId);

      setChainId(id);
      setNetwork(getNetworkName(id));
      seenTxHashesRef.current = new Set();
      lastScannedBlockRef.current = null;

      if (window.Web3) {
        const Web3 = window.Web3;
        const nextWeb3 = new Web3(window.ethereum);
        setWeb3(nextWeb3);

        if (account) {
          const nextBalance = await nextWeb3.eth.getBalance(account);
          setBalance(fromWei(nextBalance));
          await loadChainTelemetry(nextWeb3, account);
        }
      }
    };

    window.ethereum.on("accountsChanged", handleAccounts);
    window.ethereum.on("chainChanged", handleChain);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccounts);
      window.ethereum.removeListener("chainChanged", handleChain);
    };
  }, [web3, account, loadChainTelemetry]);

  const sendETH = useCallback(async () => {
    if (!web3 || !account) {
      setTxStatus({ type: "error", msg: "Connect a wallet before sending funds." });
      return;
    }

    setAddrError(false);
    setAmtError(false);

    let valid = true;
    if (!isValidAddress(toAddr)) {
      setAddrError(true);
      valid = false;
    }

    const parsedAmount = parseFloat(amount);
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmtError(true);
      valid = false;
    }

    if (!valid) {
      return;
    }

    setSending(true);
    setTxStatus({ type: "pending", msg: "Preparing transaction..." });

    try {
      const valueWei = toWei(amount);
      const tx = { from: account, to: toAddr, value: valueWei };

      const estimatedGas = await web3.eth.estimateGas(tx);
      const gasPrice = await web3.eth.getGasPrice();

      const BN = web3.utils.toBN;
      const gasCost = BN(gasPrice).mul(BN(estimatedGas));
      const totalCost = gasCost.add(BN(valueWei));
      const balanceWei = BN(await web3.eth.getBalance(account));

      if (balanceWei.lt(totalCost)) {
        throw new Error("Insufficient funds for transfer amount plus network fee.");
      }

      setTxStatus({ type: "pending", msg: "Awaiting wallet confirmation..." });

      const promi = web3.eth.sendTransaction({ ...tx, gas: estimatedGas, gasPrice });

      promi.on("transactionHash", (hash) => {
        setTxStatus({
          type: "pending",
          msg: "Transaction submitted. Waiting for block confirmation.",
          hash,
        });
      });

      promi.on("receipt", async (receipt) => {
        const hash = receipt.transactionHash;

        setTxStatus({ type: "success", msg: "Transaction confirmed.", hash });
        seenTxHashesRef.current.add(hash);
        appendTxHistory({
          type: "sent",
          to: toAddr,
          amount: formatEthAmount(amount),
          hash,
          time: new Date().toLocaleTimeString(),
          network: network || "Unknown",
        });

        setToAddr("");
        setAmount("");
        await refreshBalance();
        setSending(false);
      });

      promi.on("error", (error) => {
        const message =
          error?.message?.toLowerCase().includes("denied")
            ? "Transaction rejected by user."
            : error?.message || "Transaction failed.";

        setTxStatus({ type: "error", msg: message });
        setSending(false);
      });
    } catch (error) {
      setTxStatus({ type: "error", msg: error?.message || "Transaction preparation failed." });
      setSending(false);
    }
  }, [web3, account, toAddr, amount, refreshBalance, network, appendTxHistory]);

  const copyAddress = useCallback((value) => {
    if (!value) {
      return;
    }

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(value).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      });
    }
  }, []);

  const onAmountShortcut = useCallback(
    (ratio) => {
      if (!numericBalance) {
        return;
      }

      const nextAmount = (numericBalance * ratio).toFixed(6);
      setAmount(String(parseFloat(nextAmount)));
      setAmtError(false);
    },
    [numericBalance],
  );

  return (
    <div className="dg-shell">
      <div className="dg-background" aria-hidden="true" />

      <header className="dg-topbar">
        <div className="dg-brand">
          <div className="dg-brand-mark">DG</div>
          <div>
            <p className="dg-brand-title">DefiGuard Exchange Desk</p>
            <p className="dg-brand-subtitle">Live market + live chain telemetry</p>
          </div>
        </div>

        <div className="dg-topbar-right">
          <div className={`dg-network-pill ${isConnected ? "online" : "offline"}`}>
            <span className="dg-network-dot" />
            {isConnected ? network || "Connected" : "Wallet Offline"}
          </div>

          {isConnected ? (
            <button className="dg-btn dg-btn-ghost" onClick={disconnectWallet}>
              Disconnect
            </button>
          ) : (
            <button className="dg-btn dg-btn-primary" onClick={connectWallet} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect MetaMask"}
            </button>
          )}
        </div>
      </header>

      <section className="dg-metric-grid">
        <article className="dg-metric-card dg-metric-balance">
          <p className="dg-metric-label">Portfolio Balance</p>
          <h1 className="dg-balance-value">{isConnected ? `${balance} ETH` : "0.000000 ETH"}</h1>
          <p className="dg-balance-usd">{portfolioValueUsd}</p>

          <div className="dg-address-row">
            <p>{isConnected ? truncate(account, 10, 6) : "Connect to view account"}</p>
            {isConnected ? (
              <button className="dg-inline-btn" onClick={() => copyAddress(account)}>
                {copied ? "Copied" : "Copy"}
              </button>
            ) : null}
          </div>
        </article>

        <article className="dg-metric-card">
          <p className="dg-metric-label">Global Crypto Market</p>
          <div className="dg-stat-row">
            <span>Total Market Cap</span>
            <strong>{marketCapUsd ? formatCompactFiat(marketCapUsd) : "-"}</strong>
          </div>
          <div className="dg-stat-row">
            <span>24h Market Move</span>
            <strong className={marketCapChange24h >= 0 ? "dg-up" : "dg-down"}>
              {formatPercent(marketCapChange24h)}
            </strong>
          </div>
          <div className="dg-stat-row">
            <span>Active Cryptocurrencies</span>
            <strong>{activeCoins ? activeCoins.toLocaleString("en-US") : "-"}</strong>
          </div>
          <div className="dg-stat-row">
            <span>Last Update</span>
            <strong>{marketUpdatedAt ? new Date(marketUpdatedAt).toLocaleTimeString() : "-"}</strong>
          </div>
        </article>

        <article className="dg-metric-card">
          <p className="dg-metric-label">Network Telemetry</p>
          <div className="dg-stat-row">
            <span>Selected Chain</span>
            <strong>{network || "Not Connected"}</strong>
          </div>
          <div className="dg-stat-row">
            <span>Latest Block</span>
            <strong>{chainTelemetry.latestBlock ?? "-"}</strong>
          </div>
          <div className="dg-stat-row">
            <span>Gas Price</span>
            <strong>{chainTelemetry.gasPriceGwei ? `${chainTelemetry.gasPriceGwei} Gwei` : "-"}</strong>
          </div>
          <div className="dg-stat-row">
            <span>Pending Nonce</span>
            <strong>{chainTelemetry.nonce ?? "-"}</strong>
          </div>
          <button className="dg-btn dg-btn-quiet" onClick={refreshBalance} disabled={!isConnected}>
            Refresh Wallet Data
          </button>
        </article>
      </section>

      {marketError ? (
        <div className="dg-status dg-status-error" role="status" aria-live="polite">
          <div className="dg-status-line">
            <span className="dg-status-dot" />
            <span>{marketError}</span>
          </div>
        </div>
      ) : null}

      {chainError ? (
        <div className="dg-status dg-status-error" role="status" aria-live="polite">
          <div className="dg-status-line">
            <span className="dg-status-dot" />
            <span>{chainError}</span>
          </div>
        </div>
      ) : null}

      {txStatus ? (
        <div className={`dg-status dg-status-${txStatus.type}`} role="status" aria-live="polite">
          <div className="dg-status-line">
            <span className="dg-status-dot" />
            <span>{txStatus.msg}</span>
          </div>
          {txStatus.hash ? (
            <a
              href={`${getExplorerBase(chainId)}/tx/${txStatus.hash}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {truncate(txStatus.hash, 12, 8)}
            </a>
          ) : null}
        </div>
      ) : null}

      <main className="dg-main-grid">
        <section className="dg-panel-column">
          <article className="dg-panel">
            <div className="dg-panel-head">
              <h2>Market Pulse</h2>
              <p>Live market feed refreshes every 30 seconds</p>
            </div>

            <div className="dg-market-list">
              {marketRows.length === 0 ? (
                <p className="dg-empty">Waiting for live market data...</p>
              ) : (
                marketRows.map((asset) => {
                  const isPositive = (asset.change24h ?? 0) >= 0;
                  return (
                    <div className="dg-market-row" key={asset.symbol}>
                      <div>
                        <p className="dg-asset-symbol">{asset.symbol}</p>
                        <p className="dg-asset-name">{asset.name}</p>
                      </div>

                      <div className="dg-market-sparkline" aria-hidden="true">
                        {asset.spark.map((height, index) => (
                          <span key={`${asset.symbol}-${index}`} style={{ height: `${height}%` }} />
                        ))}
                      </div>

                      <div className="dg-market-right">
                        <p className="dg-asset-price">{asset.price ? formatFiat(asset.price) : "-"}</p>
                        <p className={isPositive ? "dg-up" : "dg-down"}>{formatPercent(asset.change24h)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </article>

          <article className="dg-panel">
            <div className="dg-panel-head">
              <h2>ETH Live Metrics</h2>
              <p>Realtime Ethereum pricing snapshot</p>
            </div>

            <div className="dg-stat-row">
              <span>ETH Spot (USD)</span>
              <strong>{ethPriceUsd ? formatFiat(ethPriceUsd) : "-"}</strong>
            </div>
            <div className="dg-stat-row">
              <span>ETH 24h Change</span>
              <strong className={ethPriceChange24h >= 0 ? "dg-up" : "dg-down"}>
                {formatPercent(ethPriceChange24h)}
              </strong>
            </div>
            <div className="dg-stat-row">
              <span>Auto Refresh</span>
              <strong>30s</strong>
            </div>
            <div className="dg-stat-row">
              <span>Source</span>
              <strong>CoinGecko API</strong>
            </div>
          </article>

          <article className="dg-panel">
            <div className="dg-panel-head">
              <h2>Activity Feed</h2>
              <p>Recent wallet events</p>
            </div>

            {txHistory.length === 0 ? (
              <p className="dg-empty">No on-chain activity yet.</p>
            ) : (
              <div className="dg-activity-list">
                {txHistory.slice(0, 5).map((tx, index) => (
                  <div className="dg-activity-row" key={`${tx.hash}-${index}`}>
                    <div>
                      <p className="dg-activity-title">
                        {tx.type === "received" ? "Received" : "Sent"} {tx.amount} ETH
                      </p>
                      <p className="dg-activity-sub">
                        {tx.type === "received"
                          ? `From ${truncate(tx.from, 10, 8)}`
                          : `To ${truncate(tx.to, 10, 8)}`}
                      </p>
                    </div>
                    <div className="dg-activity-right">
                      <p>{tx.time}</p>
                      <small>{tx.network}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>

        <section className="dg-panel-column">
          <article className="dg-panel dg-wallet-panel">
            <div className="dg-panel-head">
              <h2>Wallet Operations</h2>
              <p>Secure transfer and receiving controls</p>
            </div>

            {!isConnected ? (
              <div className="dg-connect-state">
                <p>Connect MetaMask to activate transfer tools and monitoring panels.</p>
                <button className="dg-btn dg-btn-primary" onClick={connectWallet} disabled={isConnecting}>
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </button>
              </div>
            ) : (
              <>
                <div className="dg-tabs" role="tablist" aria-label="Wallet tabs">
                  {[
                    { id: "send", label: "Send" },
                    { id: "receive", label: "Receive" },
                    { id: "history", label: "History" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={tab === item.id}
                      className={`dg-tab ${tab === item.id ? "active" : ""}`}
                      onClick={() => {
                        setTab(item.id);
                        setTxStatus(null);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {tab === "send" ? (
                  <div className="dg-form-area">
                    <label className="dg-label" htmlFor="recipient-address">
                      Recipient Address
                    </label>
                    <input
                      id="recipient-address"
                      className={`dg-input ${addrError ? "error" : ""}`}
                      placeholder="0x..."
                      value={toAddr}
                      onChange={(event) => {
                        setToAddr(event.target.value.trim());
                        setAddrError(false);
                      }}
                      spellCheck={false}
                    />
                    {addrError ? <p className="dg-field-error">Invalid Ethereum address.</p> : null}

                    <label className="dg-label" htmlFor="send-amount">
                      Amount
                    </label>
                    <div className="dg-input-wrap">
                      <input
                        id="send-amount"
                        className={`dg-input ${amtError ? "error" : ""}`}
                        placeholder="0.0"
                        type="number"
                        min="0"
                        step="any"
                        value={amount}
                        onChange={(event) => {
                          setAmount(event.target.value);
                          setAmtError(false);
                        }}
                      />
                      <span>ETH</span>
                    </div>
                    {amtError ? <p className="dg-field-error">Enter a valid amount.</p> : null}

                    <div className="dg-shortcuts">
                      <button type="button" onClick={() => onAmountShortcut(0.25)}>
                        25%
                      </button>
                      <button type="button" onClick={() => onAmountShortcut(0.5)}>
                        50%
                      </button>
                      <button type="button" onClick={() => onAmountShortcut(1)}>
                        Max
                      </button>
                    </div>

                    <p className="dg-helper">Available: {balance} ETH</p>

                    <button
                      className="dg-btn dg-btn-primary"
                      onClick={sendETH}
                      disabled={isSending || !toAddr || !amount}
                    >
                      {isSending ? "Sending..." : `Send ${amount || "0"} ETH`}
                    </button>
                  </div>
                ) : null}

                {tab === "receive" ? (
                  <div className="dg-receive-area">
                    <p className="dg-helper">Share this address to receive ETH and ERC-20 tokens.</p>

                    <div className="dg-qr-grid" aria-hidden="true">
                      {qrPattern.map((filled, index) => (
                        <span key={`qr-${index}`} className={filled ? "fill" : ""} />
                      ))}
                    </div>

                    <p className="dg-address-full">{account}</p>
                    <button className="dg-btn dg-btn-quiet" onClick={() => copyAddress(account)}>
                      {copied ? "Address Copied" : "Copy Address"}
                    </button>
                  </div>
                ) : null}

                {tab === "history" ? (
                  <div className="dg-history-area">
                    {txHistory.length === 0 ? (
                      <p className="dg-empty">No transactions found.</p>
                    ) : (
                      txHistory.map((tx, index) => (
                        <div className="dg-history-row" key={`${tx.hash}-${index}`}>
                          <div>
                            <p className="dg-history-title">{tx.type === "sent" ? "Sent" : "Received"}</p>
                            <p className="dg-history-sub">
                              {tx.type === "received"
                                ? `From ${truncate(tx.from, 8, 6)} • ${tx.time}`
                                : `To ${truncate(tx.to, 8, 6)} • ${tx.time}`}
                            </p>
                          </div>
                          <div className="dg-history-right">
                            <strong>{tx.type === "sent" ? "-" : "+"}{tx.amount} ETH</strong>
                            {tx.hash ? (
                              <a
                                href={`${getExplorerBase(chainId)}/tx/${tx.hash}`}
                                target="_blank"
                                rel="noreferrer noopener"
                              >
                                {truncate(tx.hash, 8, 6)}
                              </a>
                            ) : null}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : null}
              </>
            )}
          </article>
        </section>
      </main>

      <footer className="dg-footer">
        DefiGuard Pro UI with live CoinGecko market data and live Web3 network telemetry.
      </footer>
    </div>
  );
}
