const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

const FACTORY_ADDRESS = "0x9d045F9bAA77769986871D8e3dD83b2693A1C516";
const WETH_ADDRESS = "0x6b3bd0478DF0eC4984b168Db0E12A539Cc0c83cd";
const TOKEN_A = "0x19F38518FAffB831514CC5434A5d744b7719a246";
const TOKEN_B = "0x801FD5391C3AA6cD009C11a76F46bEb9e2C5c2B6";
const SUSHI_ADDRESS = "0xb196798512Ee7F43eb6e79e3FF5e58A01Abd93A0";
const MASTERCHEF_ADDRESS = "0x90eBdc59A930D5F7a3Ab6e3ac761ce2CE8632B25";
const ROUTER_ADDRESS = "0x5043fE1FC3302a2D303A86937296fE2bc1FeB7C2";

//! (end) BLOCKCHAIN USIGN DATA

const Web3 = require("web3");

const TokenA = require("./src/abis/ERC20Creator.json");
const TokenB = require("./src/abis/ERC20Creator1.json");
const MockERC20 = require("./src/abis/MockERC20.json");

const Pair = require("./src/abis/UniswapV2Pair.json");
const Factory = require("./src/abis/UniswapV2Factory.json");
const Router = require("./src/abis/UniswapV2Router02.json");
const WETH = require("./src/abis/WETH.json");
const Processor = require("./src/abis/Processor.json");

const Sushi = require("./src/abis/SushiToken.json");
const SushiBar = require("./src/abis/SushiBar.json");
const SushiMaker = require("./src/abis/SushiMaker.json");

const Unlock = require("./src/abis/FarmUnlockerLMDEWT.json");

const MasterChef = require("./src/abis/MasterChef.json");

const SushiRestaurant = require("./src/abis/SushiRestaurant.json");

const UniswapV2ERC20 = require("./src/abis/UniswapV2ERC20.json");

const { keccak256 } = require("@ethersproject/solidity");

const bytecode = require("./abis/UniswapV2Pair.json").bytecode;

const { ethers } = require("ethers");
// const { isCommunityResourcable } = require('@ethersproject/providers')

// const HDWalletProvider = require('./node_modules/@truffle/hdwallet-provider')

// require('dotenv').config()

// const PROCESSOR_ADDRESS = '0xFD3A18B6812b8f9b7B24e73e56b928fD26Fd55B7'

//!PROVABI

const tokenABI = [
  {
    name: "Transfer",
    inputs: [
      { type: "address", name: "_from", indexed: true },
      { type: "address", name: "_to", indexed: true },
      { type: "uint256", name: "_value", indexed: false },
    ],
    anonymous: false,
    type: "event",
  },
  {
    name: "Approval",
    inputs: [
      { type: "address", name: "_owner", indexed: true },
      { type: "address", name: "_spender", indexed: true },
      { type: "uint256", name: "_value", indexed: false },
    ],
    anonymous: false,
    type: "event",
  },
  {
    name: "__init__",
    outputs: [],
    inputs: [
      { type: "bytes32", name: "_name" },
      { type: "bytes32", name: "_symbol" },
      { type: "uint256", name: "_decimals" },
      { type: "uint256", name: "_supply" },
    ],
    constant: false,
    payable: false,
    type: "constructor",
  },
  {
    name: "deposit",
    outputs: [],
    inputs: [],
    constant: false,
    payable: true,
    type: "function",
    gas: 74279,
  },
  {
    name: "withdraw",
    outputs: [{ type: "bool", name: "out" }],
    inputs: [{ type: "uint256", name: "_value" }],
    constant: false,
    payable: false,
    type: "function",
    gas: 108706,
  },
  {
    name: "totalSupply",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 543,
  },
  {
    name: "balanceOf",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [{ type: "address", name: "_owner" }],
    constant: true,
    payable: false,
    type: "function",
    gas: 745,
  },
  {
    name: "transfer",
    outputs: [{ type: "bool", name: "out" }],
    inputs: [
      { type: "address", name: "_to" },
      { type: "uint256", name: "_value" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 74698,
  },
  {
    name: "transferFrom",
    outputs: [{ type: "bool", name: "out" }],
    inputs: [
      { type: "address", name: "_from" },
      { type: "address", name: "_to" },
      { type: "uint256", name: "_value" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 110600,
  },
  {
    name: "approve",
    outputs: [{ type: "bool", name: "out" }],
    inputs: [
      { type: "address", name: "_spender" },
      { type: "uint256", name: "_value" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 37888,
  },
  {
    name: "allowance",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "address", name: "_owner" },
      { type: "address", name: "_spender" },
    ],
    constant: true,
    payable: false,
    type: "function",
    gas: 1025,
  },
  {
    name: "name",
    outputs: [{ type: "bytes32", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 723,
  },
  {
    name: "symbol",
    outputs: [{ type: "bytes32", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 753,
  },
  {
    name: "decimals",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 783,
  },
];

//!PROVABI

const checkProcessorWorksInStructure = async () => {
  const web3 = new Web3("http://localhost:8545");

  //!wallet: Deployer

  // const wallet = new HDWalletProvider(
  //   [process.env.MNEMONIC],
  //   'https://rpc.energyweb.org',
  // )

  // const web3 = new Web3(wallet)

  //!wallet: Buyer

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const gas = new web3.utils.BN("6000000");

  const bn = new web3.utils.BN("100000000000000000000000"); //? 10,000
  const bn2 = new web3.utils.BN("10000000000000000000"); //? 100

  //TODO: Smart Contracts Main Declaration

  const factory = new web3.eth.Contract(
    Factory.abi,
    Factory.networks[id].address
  );

  const router = new web3.eth.Contract(Router.abi, Router.networks[id].address);

  const tokenA = new web3.eth.Contract(tokenABI, TokenA.networks[id].address);
  const tokenB = new web3.eth.Contract(tokenABI, TokenB.networks[id].address);

  const sushi = new web3.eth.Contract(Sushi.abi, Sushi.networks[id].address);
  const sushiBar = new web3.eth.Contract(
    SushiBar.abi,
    SushiBar.networks[id].address
  );
  const sushiMaker = new web3.eth.Contract(
    SushiMaker.abi,
    SushiMaker.networks[id].address
  );

  const sushiRestaurant = new web3.eth.Contract(
    SushiRestaurant.abi,
    SushiRestaurant.networks[id].address
  );

  const wewt = new web3.eth.Contract(WETH.abi, WETH_ADDRESS);

  let llp_tokenA_tokenB;

  //TODO: Smart Contracts Main Declaration

  try {
    const sushiBal = await sushi.methods.balanceOf(addresses[2]).call();

    const owner = await sushi.methods.owner().call();

    await sushi.methods.mint(addresses[2], web3.utils.toWei("100000000")).send({
      from: owner,
      gas: gas,
    });

    const sushiBal_ = await sushi.methods.balanceOf(addresses[2]).call();

    console.log(`
    
    Could mint SUSHI to ADD[2]

    Pre_minting ADD[2]: ${web3.utils.fromWei(sushiBal)} SUSHI
    Post_minting ADD[2]: ${web3.utils.fromWei(sushiBal_)} SUSHI

    `);
  } catch (e) {
    console.log("ERROR: Miniting SUSHIs");
    console.log(e);
  }

  try {
    await factory.methods.setFeeTo(SushiMaker.networks[id].address).send({
      from: FACTORY_DEPLOYER_ADDRESS,
      gas: gas,
    });

    // await sushiToken.transferOwnership(masterChef.address)

    console.log("Could change FEE To SushiMaker");
  } catch (e) {
    console.log("⛔️ ERROR: While CHANGING FACTORY FEE --> SushiMaker");
    console.log(e);
  }

  try {
    //! Send TOKEN A and TOKEN B to ADD[2] to provide Liquidity

    const balTokenA2 = await tokenA.methods.balanceOf(addresses[0]).call();
    const balTokenB2 = await tokenB.methods.balanceOf(addresses[0]).call();
    const balTokenSushi = await sushi.methods.balanceOf(addresses[2]).call();

    console.log(balTokenA2);
    console.log(balTokenB2);
    console.log(balTokenSushi);

    await tokenA.methods.transfer(addresses[2], bn).send({
      from: addresses[0],
      gas: gas,
    });
    await tokenB.methods.transfer(addresses[2], bn).send({
      from: addresses[0],
      gas: gas,
    });

    await sushi.methods
      .transfer(SushiRestaurant.networks[id].address, superBn)
      .send({
        from: addresses[2],
        gas: gas,
      });

    console.log(`Trying to transfer:
    
    ADD[2]: ${web3.utils.fromWei(balTokenSushi)} SUSHI to ADD[3]
    
    
    `);

    const balIn2 = await sushi.methods.balanceOf(addresses[2]).call();

    await sushi.methods.transfer(addresses[3], bn2).send({
      from: addresses[2],
      gas: gas,
    });

    const preAddLiquidityTokenA = await tokenA.methods
      .balanceOf(addresses[2])
      .call();
    const preAddLiquidityTokenB = await tokenB.methods
      .balanceOf(addresses[2])
      .call();

    console.log(`
ADD[2]: ${web3.utils.fromWei(preAddLiquidityTokenA)} TKA
ADD[2]: ${web3.utils.fromWei(preAddLiquidityTokenB)} TKB

`);
  } catch (e) {
    console.log("ERROR: While sending Token A and Token B");
    console.log(e);
  }

  setTimeout(async () => {
    try {
      const tsTokenA = await tokenA.methods.totalSupply().call();
      const tsTokenB = await tokenA.methods.totalSupply().call();
      const tsWewt = await wewt.methods.totalSupply().call();
      const tsSushi = await sushi.methods.totalSupply().call();

      console.log(`TS A: ${web3.utils.fromWei(tsTokenA)}`);
      console.log(`TS B: ${web3.utils.fromWei(tsTokenB)}`);
      console.log(`TS WEWT: ${web3.utils.fromWei(tsWewt)}`);
      console.log(`TS SUHSI: ${web3.utils.fromWei(tsSushi)}`);

      await tokenA.methods.approve(Router.networks[id].address, tsTokenA).send({
        from: addresses[2],
        gas: gas,
      });
      await tokenB.methods.approve(Router.networks[id].address, tsTokenB).send({
        from: addresses[2],
        gas: gas,
      });
      await sushi.methods.approve(Router.networks[id].address, tsSushi).send({
        from: addresses[2],
        gas: gas,
      });
      await sushi.methods
        .approve(SushiRestaurant.networks[id].address, tsSushi)
        .send({
          from: addresses[2],
          gas: gas,
        });
      //   await wewt.methods.approve(Router.networks[id].address, tsWewt).send({
      //     from: addresses[2],
      //     gas: gas,
      //   })
      console.log("SUSHI, TOKEN A , TOKEN B have been approved");
    } catch (e) {
      console.log("ERROR: While fetching Total Supply Data");
      console.log(e);
    }
  });

  setTimeout(async () => {
    try {
      //? Try to create Pair through Factory

      // await factory.methods
      //   .createPair(WETH_ADDRESS, TOKEN_A)
      //   .send({ from: addresses[2], gas: gas })
      // console.log('Pair WEWT - TKA Created')

      // console.log('Pair WEWT - SUSHI Created')

      // await factory.methods
      //   .createPair(WETH_ADDRESS, TOKEN_B)
      //   .send({ from: addresses[2], gas: gas })
      // console.log('Pair WEWT - TKB Created')

      // await factory.methods
      //   .createPair(TOKEN_A, TOKEN_B)
      //   .send({ from: addresses[2], gas: gas })
      // console.log('Pair TKA - TKB Created')

      await router.methods
        .addLiquidityETH(
          TOKEN_A,
          web3.utils.toWei("10000"),
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas, value: web3.utils.toWei("10") });
      console.log("Added liquidity to WEWT - TKA ");

      let lp_add_ = await factory.methods.getPair(WETH_ADDRESS, TOKEN_A).call();

      const swapPair_ = new web3.eth.Contract(Pair.abi, lp_add_);

      const some = await swapPair_.methods.getReserves().call();
      const lastK = await swapPair_.methods.kLast().call();

      const rootk = Math.sqrt(some[0] * some[1]);
      const rootklast = Math.sqrt(lastK);

      console.log(`
      Pair EWT - A:

      Reserve0 = ${web3.utils.fromWei(some[0])}
      Reserve1 = ${web3.utils.fromWei(some[1])}

      rootK     =  ${rootk}
      rootKLast =  ${rootklast}
      `);

      await router.methods
        .addLiquidityETH(
          Sushi.networks[id].address,
          web3.utils.toWei("100"),
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({
          from: addresses[2],
          gas: gas,
          value: web3.utils.toWei("10"),
        });

      console.log(`
      
      Could create & add liquidity for pair (WEWT - SUSHI)
      
      `);

      await router.methods
        .addLiquidityETH(
          TOKEN_B,
          web3.utils.toWei("10000"),
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas, value: web3.utils.toWei("30") });
      console.log("Added liquidity to WEWT - TKB ");

      await router.methods
        .addLiquidity(
          TOKEN_A,
          TOKEN_B,
          web3.utils.toWei("1000"),
          web3.utils.toWei("1000"),
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas });
      console.log("Added liquidity to TKA - TKB ");

      const postAddLiquidityTokenA = await tokenA.methods
        .balanceOf(addresses[2])
        .call();
      const postAddLiquidityTokenB = await tokenB.methods
        .balanceOf(addresses[2])
        .call();

      console.log(`
ADD[2]: ${web3.utils.fromWei(postAddLiquidityTokenA)} TKA
ADD[2]: ${web3.utils.fromWei(postAddLiquidityTokenB)} TKB

`);

      const llp_WEWT_A = await factory.methods
        .getPair(WETH_ADDRESS, TOKEN_A)
        .call();

      const pair = new web3.eth.Contract(Pair.abi, llp_WEWT_A);

      const add2balanceLP = await pair.methods.balanceOf(addresses[2]).call();
      console.log("ADDRESS_2 WEI format", add2balanceLP);
      console.log("ADDRESS_2 No WEI format", web3.utils.fromWei(add2balanceLP));

      // console.log(dataReturnedAddLiquidity)
    } catch (e) {
      console.log("ERROR: While Adding Liquidity to PAIR (A-B)");
      console.log(e);
    }
  }, 10 * 1000);

  setTimeout(async () => {
    //? Get Reserve INFORMATION
    try {
      lp_wewt_tka = await factory.methods.getPair(WETH_ADDRESS, TOKEN_A).call();
      console.log(`EWT - Token A LP address: ${lp_wewt_tka}`);
      const pair = new web3.eth.Contract(Pair.abi, lp_wewt_tka);
      const token0 = await pair.methods.token0().call();
      const token1 = await pair.methods.token1().call();

      console.log(`
      Token 0: ${token0}
      Token 1: ${token1}
      `);

      const reserve = await pair.methods.getReserves().call();

      console.log(`
      Reserve Token 0: ${web3.utils.fromWei(reserve._reserve0)}
      Reserve Token 1: ${web3.utils.fromWei(reserve._reserve1)}
      `);

      lp_wewt_tkb = await factory.methods.getPair(WETH_ADDRESS, TOKEN_B).call();
      console.log(`EWT - Token B LP address: ${lp_wewt_tkb}`);
      const _pair = new web3.eth.Contract(Pair.abi, lp_wewt_tkb);
      const _token0 = await _pair.methods.token0().call();
      const _token1 = await _pair.methods.token1().call();

      console.log(`
      Token 0: ${_token0}
      Token 1: ${_token1}
      `);

      const _reserve = await _pair.methods.getReserves().call();

      console.log(`
      Reserve Token 0: ${web3.utils.fromWei(_reserve._reserve0)}
      Reserve Token 1: ${web3.utils.fromWei(_reserve._reserve1)}
      `);

      lp_tka_tkb = await factory.methods.getPair(TOKEN_A, TOKEN_B).call();
      console.log(`Token A - Token B LP address: ${lp_tka_tkb}`);
      const __pair = new web3.eth.Contract(Pair.abi, lp_tka_tkb);
      const __token0 = await __pair.methods.token0().call();
      const __token1 = await __pair.methods.token1().call();

      console.log(`
      Token A: ${__token0}
      Token B: ${__token1}
      `);

      const __reserve = await __pair.methods.getReserves().call();

      console.log(`
      Reserve Token 0: ${web3.utils.fromWei(__reserve._reserve0)}
      Reserve Token 1: ${web3.utils.fromWei(__reserve._reserve1)}
      `);
    } catch (e) {
      console.log("ERROR: While Getting Pair Data");
      console.log(e);
    }
  }, 20 * 1000);

  //* SWAP EWT --> TKA (1)
  setTimeout(async () => {
    try {
      const amountOut_EWT_TKA = await router.methods
        .getAmountsOut(web3.utils.toWei("10"), [WETH_ADDRESS, TOKEN_A])
        .call({ from: addresses[3] });
      console.log(
        "I am swaping: ",
        web3.utils.fromWei(amountOut_EWT_TKA[0]),
        "wEWT",
        WETH_ADDRESS
      );
      console.log("I will get: ", web3.utils.fromWei(amountOut_EWT_TKA[1]));

      const amountOut_EWT_TKA_min = web3.utils.fromWei(amountOut_EWT_TKA[1]);

      console.log("Or a MINIMUM : ", amountOut_EWT_TKA_min, "TKA");

      const balanceTKA_before = await tokenA.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });
      console.log(`
        Purchaser ADD[3] TKA Balance (before): ${web3.utils.fromWei(
          balanceTKA_before
        )} TKA
            `);

      const swap_amount = amountOut_EWT_TKA_min.toString();

      const preETHBal = await web3.eth.getBalance(addresses[3]);
      console.log(`ETH BALANCE (before): ${web3.utils.fromWei(preETHBal)} ETH`);
      console.log("Preparing swap EWT --> TKA");
      await router.methods
        .swapETHForExactTokens(
          web3.utils.toWei(swap_amount),
          [WETH_ADDRESS, TOKEN_A],
          addresses[3],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({
          from: addresses[3],
          gas: gas,
          value: web3.utils.toWei("10"),
        });
      console.log("Done SWAP (EWT-TKA)");
      const balanceTKA_after = await tokenA.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });

      const postETHBal = await web3.eth.getBalance(addresses[3]);
      console.log(`ETH BALANCE (post): ${web3.utils.fromWei(postETHBal)} ETH`);
      console.log(`
            INFO: For 10 EWT
            Expecting AmountOutDesired: ${amountOut_EWT_TKA_min}
    Purchaser ADD[3] TKA Balance (after): ${web3.utils.fromWei(
      balanceTKA_after
    )} TKA
    `);

      let lp_add_ = await factory.methods.getPair(WETH_ADDRESS, TOKEN_A).call();

      const swapPair_ = new web3.eth.Contract(Pair.abi, lp_add_);

      const some = await swapPair_.methods.getReserves().call();
      const lastK = await swapPair_.methods.kLast().call();

      const rootk = Math.sqrt(some[0] * some[1]);
      const rootklast = Math.sqrt(lastK);

      console.log(`
    Pair EWT - A:

    Reserve0 = ${web3.utils.fromWei(some[0])}
    Reserve1 = ${web3.utils.fromWei(some[1])}

    rootK     =  ${rootk}
    rootKLast =  ${rootklast}
    `);

      let lp_add = await factory.methods.getPair(WETH_ADDRESS, TOKEN_A).call();

      const swapPair = new web3.eth.Contract(Pair.abi, lp_add);

      const kLast = await swapPair.methods.kLast().call();

      console.log(`
      After SWAP, Pair EWT-TKA kLast --> ${kLast}
    `);
    } catch (e) {
      console.log("ERROR: When trying SWAP EWT --> TKA");
      console.log(e);
    }
  }, 21 * 1000);

  setTimeout(async () => {
    try {
      const amountOut_EWT_TKA = await router.methods
        .getAmountsOut(web3.utils.toWei("25"), [
          WETH_ADDRESS,
          Sushi.networks[id].address,
        ])
        .call({ from: addresses[6] });
      console.log(
        "I am swaping: ",
        web3.utils.fromWei(amountOut_EWT_TKA[0]),
        "wEWT",
        WETH_ADDRESS
      );
      console.log("I will get: ", web3.utils.fromWei(amountOut_EWT_TKA[1]));

      const amountOut_EWT_TKA_min =
        web3.utils.fromWei(amountOut_EWT_TKA[1]) * 0.8;

      console.log("Or a MINIMUM : ", amountOut_EWT_TKA_min, "TKA");

      const balanceTKA_before = await sushi.methods
        .balanceOf(addresses[6])
        .call({ from: addresses[6] });
      console.log(`
        Purchaser ADD[3] TKA Balance (before): ${web3.utils.fromWei(
          balanceTKA_before
        )} TKA
            `);

      const swap_amount = amountOut_EWT_TKA_min.toString();

      const preETHBal = await web3.eth.getBalance(addresses[6]);
      console.log(`ETH BALANCE (before): ${web3.utils.fromWei(preETHBal)} ETH`);
      console.log("Preparing swap EWT --> SUSHI");
      await router.methods
        .swapETHForExactTokens(
          web3.utils.toWei(swap_amount),
          [WETH_ADDRESS, Sushi.networks[id].address],
          addresses[6],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({
          from: addresses[6],
          gas: gas,
          value: web3.utils.toWei("25"),
        });
      console.log("Done SWAP (EWT-SUSHI)");
      const balanceTKA_after = await tokenA.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });

      const postETHBal = await web3.eth.getBalance(addresses[6]);
      console.log(`ETH BALANCE (post): ${web3.utils.fromWei(postETHBal)} ETH`);
      console.log(`
            INFO: For 25 EWT
            Expecting AmountOutDesired: ${amountOut_EWT_TKA_min}
    Purchaser ADD[3] TKA Balance (after): ${web3.utils.fromWei(
      balanceTKA_after
    )} TKA
    `);

      let lp_add_ = await factory.methods
        .getPair(WETH_ADDRESS, Sushi.networks[id].address)
        .call();

      const swapPair_ = new web3.eth.Contract(Pair.abi, lp_add_);

      const some = await swapPair_.methods.getReserves().call();
      const lastK = await swapPair_.methods.kLast().call();

      const rootk = Math.sqrt(some[0] * some[1]);
      const rootklast = Math.sqrt(lastK);

      console.log(`
    Pair EWT - SUSHI:

    Reserve0 = ${web3.utils.fromWei(some[0])}
    Reserve1 = ${web3.utils.fromWei(some[1])}

    rootK     =  ${rootk}
    rootKLast =  ${rootklast}
    `);

      let lp_add = await factory.methods
        .getPair(WETH_ADDRESS, Sushi.networks[id].address)
        .call();

      const swapPair = new web3.eth.Contract(Pair.abi, lp_add);

      const kLast = await swapPair.methods.kLast().call();

      console.log(`
      After SWAP, Pair EWT-SUSHI kLast --> ${kLast}
    `);
    } catch (e) {
      console.log("ERROR: When trying SWAP EWT --> TKA");
      console.log(e);
    }
  }, 24 * 1000);

  setTimeout(async () => {
    const sushisInWallet = await sushi.methods.balanceOf(addresses[3]).call();

    await sushi.methods
      .approve(SushiBar.networks[id].address, sushisInWallet)
      .send({ from: addresses[3], gas: gas });

    await sushiBar.methods
      .enter(sushisInWallet)
      .send({ from: addresses[3], gas: gas });

    const postSushisInWallet = await sushi.methods
      .balanceOf(addresses[3])
      .call();

    console.log(`
    
    -- Interacting with SUSHI BAR --
    
    ADD[3] (Sushi Balance PreDeposit on BAR): ${web3.utils.fromWei(
      sushisInWallet
    )} SUSHI

    ADD[3] (Sushi Balance PostDeposit on BAR): ${web3.utils.fromWei(
      postSushisInWallet
    )} SUSHI

    `);
  }, 26 * 1000);

  //* SWAP EWT --> TKA (2)
  setTimeout(async () => {
    try {
      const tka_balance_init = await tokenA.methods
        .balanceOf(addresses[3])
        .call();

      const tkb_balance_init = await tokenB.methods
        .balanceOf(addresses[3])
        .call();

      const amountOut_TKA_TKB = await router.methods
        .getAmountsOut(tka_balance_init, [TOKEN_A, TOKEN_B])
        .call({ from: addresses[3] });

      const amountOut_TKA_TKB_min =
        web3.utils.fromWei(amountOut_TKA_TKB[1]) * 0.8;

      await tokenA.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[3],
          gas: gas,
        });

      await router.methods
        .swapTokensForExactTokens(
          amountOut_TKA_TKB[1],
          tka_balance_init,
          [TOKEN_A, TOKEN_B],
          addresses[3],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({
          from: addresses[3],
          gas: gas,
        });

      console.log("SWAP_1");

      const balanceTKB_after = await tokenB.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });
      const balanceTKA_after = await tokenA.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });

      console.log(`
        
        SUMMARY: Trading TKA --> TKB

          TKA Balance (pre): ${web3.utils.fromWei(tka_balance_init)} TKA
          TKB Balance (pre): ${web3.utils.fromWei(tkb_balance_init)} TKB

          After Trading
          -------------

          TKA Balance (post): ${web3.utils.fromWei(balanceTKA_after)} TKA
          TKB Balance (post): ${web3.utils.fromWei(balanceTKB_after)} TKB
          
        
        
        
        `);

      let lp_add_ = await factory.methods.getPair(WETH_ADDRESS, TOKEN_A).call();

      const swapPair_ = new web3.eth.Contract(Pair.abi, lp_add_);

      const some = await swapPair_.methods.getReserves().call();
      const lastK = await swapPair_.methods.kLast().call();

      const rootk = Math.sqrt(some[0] * some[1]);
      const rootklast = Math.sqrt(lastK);

      console.log(`
    Pair EWT - A:

    Reserve0 = ${web3.utils.fromWei(some[0])}
    Reserve1 = ${web3.utils.fromWei(some[1])}

    rootK     =  ${rootk}
    rootKLast =  ${rootklast}
    `);

      let lp_add = await factory.methods.getPair(WETH_ADDRESS, TOKEN_A).call();

      const swapPair = new web3.eth.Contract(Pair.abi, lp_add);

      const kLast = await swapPair.methods.kLast().call();

      console.log(`
      After SWAP, Pair EWT-TKA kLast --> ${kLast}
    `);
    } catch (e) {
      console.log("ERROR: When trying SWAP TKA --> TKB");
      console.log(e);
    }
  }, 26 * 1000);

  //   setTimeout(async () => {
  //     try {
  //       const amountOut_EWT_TKB = await router.methods
  //         .getAmountsOut(web3.utils.toWei('10'), [WETH_ADDRESS, TOKEN_B])
  //         .call({ from: addresses[3] })
  //       console.log(
  //         'I am swaping: ',
  //         web3.utils.fromWei(amountOut_EWT_TKB[0]),
  //         'wEWT',
  //         WETH_ADDRESS,
  //       )
  //       console.log('I will get: ', web3.utils.fromWei(amountOut_EWT_TKB[1]))

  //       const amountOut_EWT_TKB_min =
  //         web3.utils.fromWei(amountOut_EWT_TKB[1]) * 0.8

  //       console.log('Or a MINIMUM : ', amountOut_EWT_TKB_min, 'TKB')

  //       const balanceTKB_before = await tokenB.methods
  //         .balanceOf(addresses[3])
  //         .call({ from: addresses[3] })
  //       console.log(`
  //         Purchaser ADD[3] TKB Balance (before): ${web3.utils.fromWei(
  //           balanceTKB_before,
  //         )} TKB
  //             `)

  //       const swap_amount = web3.utils.fromWei(amountOut_EWT_TKB[1]).toString()

  //       const preETHBal = await web3.eth.getBalance(addresses[3])
  //       console.log(`ETH BALANCE (before): ${web3.utils.fromWei(preETHBal)} ETH`)
  //       console.log('Preparing swap EWT --> TKB')
  //       await router.methods
  //         .swapETHForExactTokens(
  //           web3.utils.toWei(swap_amount),
  //           [WETH_ADDRESS, TOKEN_B],
  //           addresses[3],
  //           Math.floor(Date.now() / 1000) + 60 * 10,
  //         )
  //         .send({
  //           from: addresses[3],
  //           gas: gas,
  //           value: web3.utils.toWei('10'),
  //         })
  //       console.log('Done SWAP (EWT-TKB)')
  //       const balanceTKB_after = await tokenB.methods
  //         .balanceOf(addresses[3])
  //         .call({ from: addresses[3] })

  //       const postETHBal = await web3.eth.getBalance(addresses[3])
  //       console.log(`ETH BALANCE (post): ${web3.utils.fromWei(postETHBal)} ETH`)
  //       console.log(`
  //             INFO: For 10 EWT
  //             Expecting AmountOutDesired: ${amountOut_EWT_TKB_min}
  //     Purchaser ADD[3] TKA Balance (after): ${web3.utils.fromWei(
  //       balanceTKB_after,
  //     )} TKB
  //     `)
  //     } catch (e) {
  //       console.log('ERROR: When trying SWAP EWT --> TKB')
  //       console.log(e)
  //     }
  //   }, 30 * 1000)

  setTimeout(async () => {
    //! Remove Liquidity (because TradingFees are minted when user ADDs/Withdraws Liquidity)

    try {
      const llp_WEWT_A = await factory.methods
        .getPair(WETH_ADDRESS, TOKEN_A)
        .call();

      console.log(`Removing Liquidity of: ${llp_WEWT_A}`);

      const token_llp = new web3.eth.Contract(UniswapV2ERC20.abi, llp_WEWT_A);

      const user_balance_token_llp = await token_llp.methods
        .balanceOf(addresses[2])
        .call();

      const pair_ewt_a = new web3.eth.Contract(Pair.abi, llp_WEWT_A);

      const pairData = await pair_ewt_a.methods.getReserves().call();
      console.log(`
    Pair Data:
      - Token0 (${web3.utils.fromWei(pairData._reserve0)})  
      - Token1 (${web3.utils.fromWei(pairData._reserve1)})

    `);

      let ewt_reserve;
      let tka_reserve;

      if (pairData.token0 == WETH_ADDRESS) {
        ewt_reserve = web3.utils.fromWei(pairData._reserve0);
        tka_reserve = web3.utils.fromWei(pairData._reserve1);
      } else {
        tka_reserve = web3.utils.fromWei(pairData._reserve0);
        ewt_reserve = web3.utils.fromWei(pairData._reserve1);
      }

      console.log(`
    
    
    `);

      console.log(`
    ADD[3] has ${web3.utils.fromWei(user_balance_token_llp)} EWT-A LP 
    `);

      //? Data for ANAL Remove Liquidity

      const balanceToken0 = await tokenA.methods.balanceOf(llp_WEWT_A).call();
      const balanceToken1 = await wewt.methods.balanceOf(llp_WEWT_A).call();

      const balance = await pair_ewt_a.methods.balanceOf(addresses[2]).call();
      const _balance = await token_llp.methods.balanceOf(addresses[2]).call();

      const totalS = await pair_ewt_a.methods.totalSupply().call();

      // console.log(`

      // balance TKA (pair): ${balanceToken0} TKA
      // balance EWT (pair): ${balanceToken1} wEWT

      // BalanceOfPair --> ${balance} Bal
      // _BalanceOfPair --> ${_balance} Bal

      // Total Supply: ${totalS} Ts

      // -- Calculs --

      // * amount 0 = (${balance} * ${balanceToken0}) / ${totalS}
      // amount 0 = ${(balance * balanceToken0) / totalS}
      // Result amount 0 = ${(balance * balanceToken0) / totalS}

      // * amount 1 = (${balance} * ${balanceToken1}) / ${totalS}
      // amount 1 = ${(balance * balanceToken1) / totalS}

      // require(amount0 > 0 && amount1 > 0, 'UniswapV2: INSUFFICIENT_LIQUIDITY_BURNED');

      // `)

      let withAmount = web3.utils.fromWei(_balance) * 0.5;

      // withAmount = Math.trunc(withAmount).toString()

      console.log("No Wei: ", withAmount);

      //? (End) Data for ANAL Remove Liquidity
      const bnRemove = "100";

      const approved = await pair_ewt_a.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[2],
          gas: gas,
        });

      console.log('Approved EWT-TKA LP "manipulation"');

      //? EXTRA
      const liquidity = await pair_ewt_a.methods.balanceOf(llp_WEWT_A).call();

      console.log(liquidity);
      console.log(web3.utils.fromWei(liquidity));
      //?
      amount = web3.utils.toWei(withAmount.toString(), "ether");

      await router.methods
        .removeLiquidityETH(
          TOKEN_A,
          amount,
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas });

      console.log("Could Remove (50%) Liquidity EWT-TKA");
      //   console.log('Removed liquidity from EWT - TKA')
      //   console.log(`
      //     Amount 0 --> ${web3.utils.fromWei(amount_0)}
      //     Amount 1 --> ${web3.utils.fromWei(amount_1)}
      // `)

      const endBal = await token_llp.methods.balanceOf(addresses[2]).call();
      console.log(`User has: ${web3.utils.fromWei(endBal)} EWT-TKA LP`);
    } catch (e) {
      console.log("ERROR: Removing Liquidity");
      console.log(e);
    }
  }, 35 * 1000);

  setTimeout(async () => {
    //! Remove Liquidity (because TradingFees are minted when user ADDs/Withdraws Liquidity)

    try {
      const llp_WEWT_A = await factory.methods
        .getPair(WETH_ADDRESS, Sushi.networks[id].address)
        .call();

      console.log(`Removing Liquidity of: ${llp_WEWT_A}`);

      const token_llp = new web3.eth.Contract(UniswapV2ERC20.abi, llp_WEWT_A);

      const user_balance_token_llp = await token_llp.methods
        .balanceOf(addresses[2])
        .call();

      const pair_ewt_a = new web3.eth.Contract(Pair.abi, llp_WEWT_A);

      const _balance = await token_llp.methods.balanceOf(addresses[2]).call();

      let withAmount = web3.utils.fromWei(_balance) * 0.5;

      const bnRemove = "100";

      const approved = await pair_ewt_a.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[2],
          gas: gas,
        });

      console.log('Approved EWT-TKA LP "manipulation"');

      //? EXTRA
      const liquidity = await pair_ewt_a.methods.balanceOf(llp_WEWT_A).call();

      console.log(liquidity);
      console.log(web3.utils.fromWei(liquidity));
      //?
      amount = web3.utils.toWei(withAmount.toString(), "ether");

      await router.methods
        .removeLiquidityETH(
          Sushi.networks[id].address,
          amount,
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas });

      console.log("Could Remove (50%) Liquidity EWT-SUSHI");
      //   console.log('Removed liquidity from EWT - TKA')
      //   console.log(`
      //     Amount 0 --> ${web3.utils.fromWei(amount_0)}
      //     Amount 1 --> ${web3.utils.fromWei(amount_1)}
      // `)

      const endBal = await token_llp.methods.balanceOf(addresses[2]).call();
      console.log(`User has: ${web3.utils.fromWei(endBal)} EWT-SUSHI LP`);
    } catch (e) {
      console.log("ERROR: Removing Liquidity");
      console.log(e);
    }
  }, 37 * 1000);

  setTimeout(async () => {
    //! Remove Liquidity (because TradingFees are minted when user ADDs/Withdraws Liquidity)

    try {
      const llp_WEWT_A = await factory.methods.getPair(TOKEN_A, TOKEN_B).call();

      console.log(`Removing Liquidity of: ${llp_WEWT_A}`);

      const token_llp = new web3.eth.Contract(UniswapV2ERC20.abi, llp_WEWT_A);

      const pair_ewt_a = new web3.eth.Contract(Pair.abi, llp_WEWT_A);

      const _balance = await token_llp.methods.balanceOf(addresses[2]).call();

      let withAmount = web3.utils.fromWei(_balance) * 0.5;

      // withAmount = Math.trunc(withAmount).toString()

      console.log("No Wei: ", withAmount);

      //? (End) Data for ANAL Remove Liquidity
      const bnRemove = "100";

      const approved = await pair_ewt_a.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[2],
          gas: gas,
        });

      console.log('Approved EWT-TKA LP "manipulation"');

      //? EXTRA
      const liquidity = await pair_eth_a.methods.balanceOf(llp_WEWT_A).call();

      console.log(liquidity);
      console.log(web3.utils.fromWei(liquidity));
      //?
      amount = web3.utils.toWei(withAmount.toString(), "ether");

      await router.methods
        .removeLiquidity(
          TOKEN_A,
          TOKEN_B,
          amount,
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas });

      console.log("Could Remove (50%) Liquidity TKA-TKB");
      //   console.log('Removed liquidity from EWT - TKA')
      //   console.log(`
      //     Amount 0 --> ${web3.utils.fromWei(amount_0)}
      //     Amount 1 --> ${web3.utils.fromWei(amount_1)}
      // `)

      const endBal = await token_llp.methods.balanceOf(addresses[2]).call();
      console.log(`User has: ${web3.utils.fromWei(endBal)} TKA-TKB LP`);
    } catch (e) {
      console.log("ERROR: Removing Liquidity");
      console.log(e);
    }
  }, 39 * 1000);

  setTimeout(async () => {
    try {
      await sushiMaker.methods.changeChecker(addresses[6]).send({
        from: addresses[9],
        gas: gas,
      });
      console.log("Could CHANGE checker --> add[6]");
      await sushiMaker.methods.changeProtocol(addresses[7]).send({
        from: addresses[6],
        gas: gas,
      });

      console.log("✅ CAN CHANGE CHECKER and PROTOCOL being a ADMIN");
    } catch (e) {
      console.log("⛔️ CAN NOT CHANGE CHECKER and PROTOCOL being a ADMIN");
    }
  }, 40 * 1000);

  setTimeout(async () => {
    try {
      await sushiMaker.methods.changeChecker(addresses[6]).send({
        from: addresses[1],
        gas: gas,
      });
      console.log("Could CHANGE checker --> add[6]");
      await sushiMaker.methods.changeProtocol(addresses[7]).send({
        from: addresses[1],
        gas: gas,
      });
      console.log("⛔️ CAN CHANGE CHECKER or PROTOCOL being a mindungui");
    } catch (e) {
      console.log("✅ CAN NOT CHANGE CHECKER or PROTOCOL being a mindungui");
    }
  }, 42 * 1000);

  setTimeout(async () => {
    try {
      await sushiMaker.methods.convert(WETH_ADDRESS, TOKEN_A).send({
        from: addresses[4],
        gas: gas,
      });
      console.log("Could Execute: Sushi Maker convert() ");
    } catch (e) {
      console.log("FAILED ON SUSHI MAKER CONVERT");
      console.log(e);
    }
  }, 44 * 1000);

  setTimeout(async () => {
    try {
      await sushiMaker.methods.convert(TOKEN_A, TOKEN_B).send({
        from: addresses[5],
        gas: gas,
      });
      console.log("Could Execute: Sushi Maker convert() ");
    } catch (e) {
      console.log("FAILED ON SUSHI MAKER CONVERT");
      console.log(e);
    }
  }, 46 * 1000);

  setTimeout(async () => {
    try {
      await sushiMaker.methods
        .convert(WETH_ADDRESS, Sushi.networks[id].address)
        .send({
          from: addresses[5],
          gas: gas,
        });
      console.log("Could Execute: Sushi Maker convert() ");
    } catch (e) {
      console.log("FAILED ON SUSHI MAKER CONVERT");
      console.log(e);
    }
  }, 48 * 1000);

  //! Sushi Bar (User approach) deposit SUSHI --> get xSUSHI, then xSUSHI to SUSHI (increase SUSHI amount?)

  //* SWAPs WEWT --> EWT (Fee)
  // setTimeout(async () => {
  //   try {
  //     const wrappedETH = await wewt.methods.balanceOf(addresses[9]).call()

  //     const goodBal = new web3.utils.BN(wrappedETH.toString()) //? 10

  //     //! APPROVE WETH Contract to handle tokens

  //     const approve = wewt.methods
  //       .approve(WETH_ADDRESS, goodBal)
  //       .send({ from: addresses[9], gas: gas })

  //     console.log(approve)
  //     console.log('APPROVED')
  //     console.log('APPROVED')
  //     console.log('APPROVED')

  //     const balancePreWithdraw = await web3.eth.getBalance(addresses[9])

  //     await wewt.methods.withdraw(goodBal).send({
  //       from: addresses[9],
  //       gas: gas,
  //     })
  //     console.log('Could convert WEWT --> EWT on my FEE')

  //     const balancePostWithdraw = await web3.eth.getBalance(addresses[9])

  //     console.log(`

  //     My Fee ADD[9] (PreGetFee): ${web3.utils.fromWei(balancePreWithdraw)} EWT
  //     My Fee ADD[9] (PostGetFee): ${web3.utils.fromWei(balancePostWithdraw)} EWT

  //     Result EWT Fee Profit: ${
  //       web3.utils.fromWei(balancePostWithdraw) -
  //       web3.utils.fromWei(balancePreWithdraw)
  //     } EWT

  //     `)
  //   } catch (e) {
  //     console.log('ERROR: When converting WEWT --> EWT on my FEE')
  //     console.log(e)
  //   }
  // }, 45 * 1000)
  //* END: SWAPs WEWT --> EWT (Fee)

  //! Check if SYST. ARQUITECTURE worked

  setTimeout(async () => {
    try {
      const add3_sushi_in_bar = await sushiBar.methods
        .balanceOf(addresses[3])
        .call();
      await sushiBar.methods
        .leave(add3_sushi_in_bar)
        .send({ from: addresses[3], gas: gas });

      console.log("✅ Could leave SUSHI Bar");

      const sushiPostBar = await sushi.methods.balanceOf(addresses[3]).call();

      console.log(`
      
      _ Post Sushi Bar Summary _

      ADD[3]:  ${web3.utils.fromWei(sushiPostBar)} SUSHI        
      
      `);
    } catch (e) {
      console.log("ERROR: While checking FINAL DATA");
      console.log(e);
    }
  }, 50 * 1000);

  setTimeout(async () => {
    try {
      const addressPair = await factory.methods
        .getPair(WETH_ADDRESS, TOKEN_A)
        .call();
      const addressPair_1 = await factory.methods
        .getPair(WETH_ADDRESS, Sushi.networks[id].address)
        .call();
      const addressPair_2 = await factory.methods
        .getPair(WETH_ADDRESS, TOKEN_B)
        .call();
      const addressPair_3 = await factory.methods
        .getPair(TOKEN_A, TOKEN_B)
        .call();
      const ewt_tka_lp_contract = new web3.eth.Contract(tokenABI, addressPair);
      const ewt_sushi_lp_contract = new web3.eth.Contract(
        tokenABI,
        addressPair_1
      );
      const ewt_tkb_lp_contract = new web3.eth.Contract(
        tokenABI,
        addressPair_2
      );
      const tka_tkb_lp_contract = new web3.eth.Contract(
        tokenABI,
        addressPair_3
      );

      const balFee = await wewt.methods.balanceOf(addresses[9]).call();
      const balFee_ = await web3.eth.getBalance(addresses[9]);
      const balFee__ = await sushi.methods.balanceOf(addresses[9]).call();
      const _balFee = await ewt_tka_lp_contract.methods
        .balanceOf(addresses[9])
        .call();

      const __balFee = await ewt_sushi_lp_contract.methods
        .balanceOf(addresses[9])
        .call();

      console.log(`
      
      _ MY FEES Summary _

      ADD[9]: ${web3.utils.fromWei(_balFee)} LP (EWT-TKA)
      ADD[9]: ${web3.utils.fromWei(__balFee)} LP (EWT-SUSHI)
      ADD[9]: ${web3.utils.fromWei(balFee__)} SUSHI        
      ADD[9]: ${web3.utils.fromWei(balFee)} WEWT        
      ADD[9]: ${web3.utils.fromWei(balFee_) - 100} EWT (real Profit)
      
      `);

      const lmnFee = await wewt.methods.balanceOf(addresses[8]).call();
      const lmnFee_ = await web3.eth.getBalance(addresses[8]);
      const lmnFee__ = await sushi.methods.balanceOf(addresses[8]).call();
      const _lmnFee = await ewt_tka_lp_contract.methods
        .balanceOf(addresses[8])
        .call();

      const __lmnFee = await ewt_sushi_lp_contract.methods
        .balanceOf(addresses[8])
        .call();

      console.log(`
      
      _ Lemonade FEES Summary _

      Lemon Fee[8]: ${web3.utils.fromWei(_lmnFee)} LP (EWT-TKA)
      Lemon Fee[8]: ${web3.utils.fromWei(__lmnFee)} LP (EWT-SUSHI)
      Lemon Fee[8]: ${web3.utils.fromWei(lmnFee__)} SUSHI        
      Lemon Fee[8]: ${web3.utils.fromWei(lmnFee)} WEWT        
      Lemon Fee[8]: ${web3.utils.fromWei(lmnFee_) - 100} EWT (real Profit)
      
      `);

      const sushiMaker_sushi = await sushi.methods
        .balanceOf(SushiMaker.networks[id].address)
        .call();
      const sushiMaker_ewt = await web3.eth.getBalance(
        SushiMaker.networks[id].address
      );
      const sushiMaker_wewt = await wewt.methods
        .balanceOf(SushiMaker.networks[id].address)
        .call();
      const sushiMaker_ewt_tka_lp = await ewt_tka_lp_contract.methods
        .balanceOf(SushiMaker.networks[id].address)
        .call();
      const sushiMaker_ewt_sushi_lp = await ewt_sushi_lp_contract.methods
        .balanceOf(SushiMaker.networks[id].address)
        .call();
      const sushiMaker_ewt_tkb_lp = await ewt_tkb_lp_contract.methods
        .balanceOf(SushiMaker.networks[id].address)
        .call();
      const sushiMaker_tka_tkb_lp = await tka_tkb_lp_contract.methods
        .balanceOf(SushiMaker.networks[id].address)
        .call();

      console.log(`
      
      _ Sushi Maker Summary _

      SushiMaker ADD: ${web3.utils.fromWei(sushiMaker_ewt_tka_lp)} LP (EWT-TKA)
      SushiMaker ADD: ${web3.utils.fromWei(
        sushiMaker_ewt_sushi_lp
      )} LP (EWT-SUSHI)
      SushiMaker ADD: ${web3.utils.fromWei(sushiMaker_ewt_tkb_lp)} LP (EWT-TKB)
      SushiMaker ADD: ${web3.utils.fromWei(sushiMaker_tka_tkb_lp)} LP (TKA-TKB)
      SushiMaker ADD: ${web3.utils.fromWei(sushiMaker_sushi)} SUSHI        
      SushiMaker ADD: ${web3.utils.fromWei(sushiMaker_wewt)} WEWT 
      SushiMaker ADD: ${web3.utils.fromWei(sushiMaker_ewt)} EWT (real Profit)
      
      `);

      const sushiBar_sushi = await sushi.methods
        .balanceOf(SushiBar.networks[id].address)
        .call();
      const sushiBar_ewt = await web3.eth.getBalance(
        SushiBar.networks[id].address
      );
      const sushiBar_wewt = await wewt.methods
        .balanceOf(SushiBar.networks[id].address)
        .call();
      const sushiBar_ewt_tka_lp = await ewt_tka_lp_contract.methods
        .balanceOf(SushiBar.networks[id].address)
        .call();

      console.log(`
      
      _ Sushi Bar Summary _

      SushiMaker ADD: ${web3.utils.fromWei(sushiBar_ewt_tka_lp)} LP (EWT-TKA)
      SushiMaker ADD: ${web3.utils.fromWei(sushiBar_sushi)} SUSHI        
      SushiMaker ADD: ${web3.utils.fromWei(sushiBar_wewt)} WEWT 
      SushiMaker ADD: ${web3.utils.fromWei(sushiBar_ewt)} EWT (real Profit)
      
      `);
    } catch (e) {
      console.log("ERROR: While checking FINAL DATA");
      console.log(e);
    }
  }, 55 * 1000);
};

const playingWithRestaurant = async () => {
  const web3 = new Web3("http://localhost:8545");

  //!wallet: Deployer

  // const wallet = new HDWalletProvider(
  //   [process.env.MNEMONIC],
  //   'https://rpc.energyweb.org',
  // )

  // const web3 = new Web3(wallet)

  //!wallet: Buyer

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const gas = new web3.utils.BN("6000000");

  const superBn = new web3.utils.BN(
    "10000000000000000000000000000000000000000"
  ); //? 10,000
  const bn = new web3.utils.BN("100000000000000000000000"); //? 10,000
  const bn2 = new web3.utils.BN("100000000000000000000"); //? 100

  //TODO: Smart Contracts Main Declaration

  const factory = new web3.eth.Contract(Factory.abi, FACTORY_ADDRESS);

  const router = new web3.eth.Contract(Router.abi, Router.networks[id].address);

  const tokenA = new web3.eth.Contract(tokenABI, TOKEN_A);
  const tokenB = new web3.eth.Contract(tokenABI, TOKEN_B);

  const sushi = new web3.eth.Contract(Sushi.abi, Sushi.networks[id].address);
  const sushiBar = new web3.eth.Contract(
    SushiBar.abi,
    SushiBar.networks[id].address
  );
  const sushiMaker = new web3.eth.Contract(
    SushiMaker.abi,
    SushiMaker.networks[id].address
  );

  const sushiRestaurant = new web3.eth.Contract(
    SushiRestaurant.abi,
    SushiRestaurant.networks[id].address
  );

  const wewt = new web3.eth.Contract(WETH.abi, WETH_ADDRESS);

  let llp_tokenA_tokenB;

  //TODO: Smart Contracts Main Declaration

  try {
    const sushiBal = await sushi.methods.balanceOf(addresses[2]).call();

    const owner = await sushi.methods.owner().call();

    await sushi.methods.mint(addresses[2], superBn).send({
      from: owner,
      gas: gas,
    });

    await sushi.methods.mint(addresses[2], bn).send({
      from: owner,
      gas: gas,
    });

    const sushiBal_ = await sushi.methods.balanceOf(addresses[2]).call();

    console.log(`
    
    Could mint SUSHI to ADD[2]

    Pre_minting ADD[2]: ${web3.utils.fromWei(sushiBal)} SUSHI
    Post_minting ADD[2]: ${web3.utils.fromWei(sushiBal_)} SUSHI

    `);
  } catch (e) {
    console.log("ERROR: Miniting SUSHIs");
    console.log(e);
  }

  try {
    await factory.methods.setFeeTo(SushiMaker.networks[id].address).send({
      from: FACTORY_DEPLOYER_ADDRESS,
      gas: gas,
    });
    console.log("Could change FEE To SushiMaker");
  } catch (e) {
    console.log("⛔️ ERROR: While CHANGING FACTORY FEE --> SushiMaker");
    console.log(e);
  }

  try {
    //! Send TOKEN A and TOKEN B to ADD[2] to provide Liquidity

    const balTokenA2 = await tokenA.methods.balanceOf(addresses[0]).call();
    const balTokenB2 = await tokenB.methods.balanceOf(addresses[0]).call();
    const balTokenSushi = await sushi.methods.balanceOf(addresses[2]).call();

    console.log(balTokenA2);
    console.log(balTokenB2);
    console.log(balTokenSushi);

    await tokenA.methods.transfer(addresses[2], bn).send({
      from: addresses[0],
      gas: gas,
    });
    await tokenB.methods.transfer(addresses[2], bn).send({
      from: addresses[0],
      gas: gas,
    });

    // AQUI
    await sushi.methods
      .transfer(SushiRestaurant.networks[id].address, superBn)
      .send({
        from: addresses[2],
        gas: gas,
      });
    await sushi.methods.transfer(addresses[3], bn).send({
      from: addresses[2],
      gas: gas,
    });

    console.log(`Trying to transfer:
    
    ADD[2]: ${web3.utils.fromWei(balTokenSushi)} SUSHI to ADD[3]
    
    
    `);
  } catch (e) {
    console.log("ERROR: While sending Token A and Token B");
    console.log(e);
  }

  setTimeout(async () => {
    try {
      const tsTokenA = await tokenA.methods.totalSupply().call();
      const tsTokenB = await tokenA.methods.totalSupply().call();
      const tsWewt = await wewt.methods.totalSupply().call();
      const tsSushi = await sushi.methods.totalSupply().call();

      console.log(`TS A: ${web3.utils.fromWei(tsTokenA)}`);
      console.log(`TS B: ${web3.utils.fromWei(tsTokenB)}`);
      console.log(`TS WEWT: ${web3.utils.fromWei(tsWewt)}`);
      console.log(`TS SUHSI: ${web3.utils.fromWei(tsSushi)}`);

      await tokenA.methods.approve(Router.networks[id].address, tsTokenA).send({
        from: addresses[2],
        gas: gas,
      });
      await tokenB.methods.approve(Router.networks[id].address, tsTokenB).send({
        from: addresses[2],
        gas: gas,
      });
      await sushi.methods.approve(Router.networks[id].address, tsSushi).send({
        from: addresses[2],
        gas: gas,
      });
      await sushi.methods
        .approve(SushiRestaurant.networks[id].address, tsSushi)
        .send({
          from: addresses[3],
          gas: gas,
        });
      //   await wewt.methods.approve(Router.networks[id].address, tsWewt).send({
      //     from: addresses[2],
      //     gas: gas,
      //   })
      console.log("SUSHI, TOKEN A , TOKEN B have been approved");
    } catch (e) {
      console.log("ERROR: While fetching Total Supply Data");
      console.log(e);
    }
  });

  setTimeout(async () => {
    const bal = await sushi.methods.balanceOf(addresses[3]).call();

    console.log(`ADD[3] (pre): ${web3.utils.fromWei(bal)} SUSHI`);

    await sushiRestaurant.methods.enter(bal).send({
      from: addresses[3],
      gas: gas,
    });

    const postBal = await sushi.methods.balanceOf(addresses[3]).call();
    console.log(`ADD[3] (post): ${web3.utils.fromWei(postBal)} SUSHI`);

    const userInfo = await sushiRestaurant.methods
      .userInfo(addresses[3])
      .call();

    console.log(`
    
    USER INFO -->
    ${userInfo}


    ----
    USER INFO.amount -->
    ${web3.utils.fromWei(userInfo.amount)} SUSHI (staked)
    USER INFO.share -->
    ${web3.utils.fromWei(userInfo.share)} SUSHI (share)
    USER INFO.rewardDebt -->
      ${web3.utils.fromWei(userInfo.rewardDebt)} SUSHI (reward Debt)

    `);
  }, 5 * 1000);

  setTimeout(async () => {
    await web3.eth.sendTransaction({
      from: addresses[3],
      to: addresses[4],
      value: web3.utils.toWei("1"),
      gas: gas,
    });

    const bal = await sushi.methods.balanceOf(addresses[3]).call();

    console.log(`ADD[2] (pre): ${web3.utils.fromWei(bal)} SUSHI`);

    const some = await sushiRestaurant.methods
      .getPendingReward(addresses[3])
      .call({
        from: addresses[3],
      });

    console.log(`After Trade nº 1:
                ADD[3] Pdt. Reward: ${web3.utils.fromWei(some)} SUSHI
    `);
  }, 10 * 1000);
  setTimeout(async () => {
    await web3.eth.sendTransaction({
      from: addresses[3],
      to: addresses[4],
      value: web3.utils.toWei("1"),
      gas: gas,
    });

    const bal = await sushi.methods.balanceOf(addresses[3]).call();

    console.log(`ADD[3] (pre): ${web3.utils.fromWei(bal)} SUSHI`);

    const some = await sushiRestaurant.methods
      .getPendingReward(addresses[3])
      .call({
        from: addresses[3],
      });

    console.log(`After Trade nº 2:
                ADD[2] Pdt. Reward: ${web3.utils.fromWei(some)} SUSHI
    `);
  }, 12 * 1000);
  setTimeout(async () => {
    await web3.eth.sendTransaction({
      from: addresses[3],
      to: addresses[4],
      value: web3.utils.toWei("1"),
      gas: gas,
    });
    const bal = await sushi.methods.balanceOf(addresses[3]).call();

    console.log(`ADD[2] (pre): ${web3.utils.fromWei(bal)} SUSHI`);

    const some = await sushiRestaurant.methods
      .getPendingReward(addresses[3])
      .call({
        from: addresses[3],
      });

    console.log(`After Trade nº 3:
                ADD[2] Pdt. Reward: ${web3.utils.fromWei(some)} SUSHI
    `);
  }, 14 * 1000);
  setTimeout(async () => {
    await web3.eth.sendTransaction({
      from: addresses[3],
      to: addresses[4],
      value: web3.utils.toWei("1"),
      gas: gas,
    });

    const bal = await sushi.methods.balanceOf(addresses[3]).call();

    console.log(`ADD[2] (pre): ${web3.utils.fromWei(bal)} SUSHI`);

    const some = await sushiRestaurant.methods
      .getPendingReward(addresses[3])
      .call({
        from: addresses[3],
      });

    console.log(`After Trade nº 4:
                ADD[2] Pdt. Reward: ${web3.utils.fromWei(some)} SUSHI
    `);
  }, 16 * 1000);
  setTimeout(async () => {
    await web3.eth.sendTransaction({
      from: addresses[3],
      to: addresses[4],
      value: web3.utils.toWei("1"),
      gas: gas,
    });

    const bal = await sushi.methods.balanceOf(addresses[3]).call();

    console.log(`ADD[2] (pre): ${web3.utils.fromWei(bal)} SUSHI`);

    const some = await sushiRestaurant.methods
      .getPendingReward(addresses[3])
      .call({
        from: addresses[3],
      });

    console.log(`After Trade nº 5:
                ADD[2] Pdt. Reward: ${web3.utils.fromWei(some)} SUSHI
    `);
  }, 18 * 1000);
  setTimeout(async () => {
    await web3.eth.sendTransaction({
      from: addresses[3],
      to: addresses[4],
      value: web3.utils.toWei("1"),
      gas: gas,
    });

    const bal = await sushi.methods.balanceOf(addresses[3]).call();

    console.log(`ADD[2] (pre): ${web3.utils.fromWei(bal)} SUSHI`);

    const some = await sushiRestaurant.methods
      .getPendingReward(addresses[3])
      .call({
        from: addresses[3],
      });

    console.log(`After Trade nº 6:
                ADD[2] Pdt. Reward: ${web3.utils.fromWei(some)} SUSHI
    `);
  }, 20 * 1000);

  setTimeout(async () => {
    const userInfo = await sushiRestaurant.methods
      .userInfo(addresses[3])
      .call();
    const amount = userInfo.amount;

    await sushiRestaurant.methods.leave(amount).send({
      from: addresses[3],
      gas: gas,
    });

    const balance = await sushi.methods.balanceOf(addresses[3]).call();
    console.log(`
    
    ADD[2] (final Balance): ${web3.utils.fromWei(balance)} SUSHI

    `);
  }, 30 * 1000);
};

const poolRatioCheck = async () => {
  const web3 = new Web3("http://localhost:8545");

  //!wallet: Deployer

  // const wallet = new HDWalletProvider(
  //   [process.env.MNEMONIC],
  //   'https://rpc.energyweb.org',
  // )

  // const web3 = new Web3(wallet)

  //!wallet: Buyer

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const gas = new web3.utils.BN("6000000");

  const bn = new web3.utils.BN("1000000000000000000000000000000000"); //? 10,000

  //TODO: Smart Contracts Main Declaration

  const factory = new web3.eth.Contract(Factory.abi, FACTORY_ADDRESS);

  const router = new web3.eth.Contract(Router.abi, Router.networks[id].address);

  const tokenA = new web3.eth.Contract(tokenABI, TOKEN_A);
  const tokenB = new web3.eth.Contract(tokenABI, TOKEN_B);

  const sushi = new web3.eth.Contract(Sushi.abi, Sushi.networks[id].address);
  const sushiBar = new web3.eth.Contract(
    SushiBar.abi,
    SushiBar.networks[id].address
  );
  const sushiMaker = new web3.eth.Contract(
    SushiMaker.abi,
    SushiMaker.networks[id].address
  );

  const wewt = new web3.eth.Contract(WETH.abi, WETH_ADDRESS);

  let llp_tokenA_tokenB;

  //TODO: Smart Contracts Main Declaration

  try {
    const sushiBal = await sushi.methods.balanceOf(addresses[2]).call();

    const owner = await sushi.methods.owner().call();

    await sushi.methods.mint(addresses[2], web3.utils.toWei("1000000")).send({
      from: owner,
      gas: gas,
    });

    const sushiBal_ = await sushi.methods.balanceOf(addresses[2]).call();

    console.log(`
    
    Could mint SUSHI to ADD[2]

    Pre_minting ADD[2]: ${web3.utils.fromWei(sushiBal)} SUSHI
    Post_minting ADD[2]: ${web3.utils.fromWei(sushiBal_)} SUSHI

    `);
  } catch (e) {
    console.log("ERROR: Miniting SUSHIs");
    console.log(e);
  }

  try {
    await factory.methods.setFeeTo(SushiMaker.networks[id].address).send({
      from: FACTORY_DEPLOYER_ADDRESS,
      gas: gas,
    });
    console.log("Could change FEE To SushiMaker");
  } catch (e) {
    console.log("⛔️ ERROR: While CHANGING FACTORY FEE --> SushiMaker");
    console.log(e);
  }

  try {
    //! Send TOKEN A and TOKEN B to ADD[2] to provide Liquidity

    const balTokenA2 = await tokenA.methods.balanceOf(addresses[0]).call();
    const balTokenB2 = await tokenB.methods.balanceOf(addresses[0]).call();

    console.log(balTokenA2);
    console.log(balTokenB2);

    await tokenA.methods.transfer(addresses[2], bn).send({
      from: addresses[0],
      gas: gas,
    });
    await tokenB.methods.transfer(addresses[2], bn).send({
      from: addresses[0],
      gas: gas,
    });
  } catch (e) {
    console.log("ERROR: While sending Token A and Token B");
    console.log(e);
  }

  setTimeout(async () => {
    try {
      const tsTokenA = await tokenA.methods.totalSupply().call();
      const tsTokenB = await tokenA.methods.totalSupply().call();
      const tsWewt = await wewt.methods.totalSupply().call();
      const tsSushi = await sushi.methods.totalSupply().call();

      console.log(`TS A: ${web3.utils.fromWei(tsTokenA)}`);
      console.log(`TS B: ${web3.utils.fromWei(tsTokenB)}`);
      console.log(`TS WEWT: ${web3.utils.fromWei(tsWewt)}`);
      console.log(`TS SUHSI: ${web3.utils.fromWei(tsSushi)}`);

      await tokenA.methods.approve(Router.networks[id].address, tsTokenA).send({
        from: addresses[2],
        gas: gas,
      });
      await tokenB.methods.approve(Router.networks[id].address, tsTokenB).send({
        from: addresses[2],
        gas: gas,
      });
      await sushi.methods.approve(Router.networks[id].address, tsSushi).send({
        from: addresses[2],
        gas: gas,
      });
      //   await wewt.methods.approve(Router.networks[id].address, tsWewt).send({
      //     from: addresses[2],
      //     gas: gas,
      //   })
      console.log("SUSHI, TOKEN A , TOKEN B have been approved");
      console.log("✅ All tokens Approved for ROUTER");
    } catch (e) {
      console.log("ERROR: While fetching Total Supply Data");
      console.log(e);
    }
  });

  setTimeout(async () => {
    try {
      await router.methods
        .addLiquidityETH(
          TOKEN_A,
          web3.utils.toWei("1000"),
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas, value: web3.utils.toWei("20") });
      console.log("Added liquidity to WEWT - TKA ");

      let lp_add_ = await factory.methods.getPair(WETH_ADDRESS, TOKEN_A).call();

      const swapPair_ = new web3.eth.Contract(Pair.abi, lp_add_);

      const some = await swapPair_.methods.getReserves().call();
      const lastK = await swapPair_.methods.kLast().call();

      const rootk = Math.sqrt(some[0] * some[1]);
      const rootklast = Math.sqrt(lastK);

      console.log(`
      Pair EWT - A:

      Reserve0 = ${web3.utils.fromWei(some[0])}
      Reserve1 = ${web3.utils.fromWei(some[1])}

      rootK     =  ${rootk}
      rootKLast =  ${rootklast}
      `);

      await router.methods
        .addLiquidityETH(
          Sushi.networks[id].address,
          web3.utils.toWei("1000"),
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({
          from: addresses[2],
          gas: gas,
          value: web3.utils.toWei("20"),
        });

      console.log(`
      
      Could Create & Add liquidity for pair (WEWT - SUSHI)
      
      `);

      await router.methods
        .addLiquidityETH(
          TOKEN_B,
          web3.utils.toWei("1000"),
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas, value: web3.utils.toWei("10") });
      console.log("Added liquidity to WEWT - TKB ");

      await router.methods
        .addLiquidity(
          TOKEN_A,
          TOKEN_B,
          web3.utils.toWei("1000"),
          web3.utils.toWei("1000"),
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas });
      console.log("Added liquidity to TKA - TKB ");

      console.log("✅ Pairs Created and Liquidity Added");
    } catch (e) {
      console.log("ERROR: While Adding Liquidity to PAIR (A-B)");
      console.log(e);
    }
  }, 10 * 1000);

  //* SWAP EWT --> TKA (1)
  setTimeout(async () => {
    try {
      const amountOut_EWT_TKA = await router.methods
        .getAmountsOut(web3.utils.toWei("1"), [WETH_ADDRESS, TOKEN_A])
        .call({ from: addresses[3] });
      console.log(
        "I am swaping: ",
        web3.utils.fromWei(amountOut_EWT_TKA[0]),
        "wEWT",
        WETH_ADDRESS
      );
      console.log("I will get: ", web3.utils.fromWei(amountOut_EWT_TKA[1]));

      const amountOut_EWT_TKA_min = web3.utils.fromWei(amountOut_EWT_TKA[1]);

      const balanceTKA_before = await tokenA.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });
      console.log(`
        Purchaser ADD[3] TKA Balance (before): ${web3.utils.fromWei(
          balanceTKA_before
        )} TKA
            `);

      const swap_amount = amountOut_EWT_TKA_min.toString();

      const preETHBal = await web3.eth.getBalance(addresses[3]);
      console.log(`ETH BALANCE (before): ${web3.utils.fromWei(preETHBal)} ETH`);
      console.log("Preparing swap EWT --> TKA");
      await router.methods
        .swapETHForExactTokens(
          web3.utils.toWei(swap_amount),
          [WETH_ADDRESS, TOKEN_A],
          addresses[3],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({
          from: addresses[3],
          gas: gas,
          value: web3.utils.toWei("1"),
        });
      console.log("Done SWAP (EWT-TKA)");
      const balanceTKA_after = await tokenA.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });

      const postETHBal = await web3.eth.getBalance(addresses[3]);
      console.log(`ETH BALANCE (post): ${web3.utils.fromWei(postETHBal)} ETH`);
      console.log(`

      // PURCHASE Pair 0: (EWT - TKA)
-------------------------------------
        Purchaser ADD[3] TKA Balance (after): ${web3.utils.fromWei(
          balanceTKA_after
        )} TKA
            `);
    } catch (e) {
      console.log("ERROR: When trying SWAP EWT --> TKA");
      console.log(e);
    }
  }, 21 * 1000);

  setTimeout(async () => {
    try {
      const amountOut_EWT_TKA = await router.methods
        .getAmountsOut(web3.utils.toWei("1"), [
          WETH_ADDRESS,
          Sushi.networks[id].address,
        ])
        .call({ from: addresses[3] });
      console.log(
        "I am swaping: ",
        web3.utils.fromWei(amountOut_EWT_TKA[0]),
        "wEWT",
        WETH_ADDRESS
      );
      console.log("I will get: ", web3.utils.fromWei(amountOut_EWT_TKA[1]));

      const amountOut_EWT_TKA_min = web3.utils.fromWei(amountOut_EWT_TKA[1]);

      console.log("Or a MINIMUM : ", amountOut_EWT_TKA_min, "TKA");

      const balanceTKA_before = await sushi.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });

      const swap_amount = amountOut_EWT_TKA_min.toString();

      const preETHBal = await web3.eth.getBalance(addresses[3]);
      console.log(`ETH BALANCE (before): ${web3.utils.fromWei(preETHBal)} ETH`);
      console.log("Preparing swap EWT --> SUSHI");
      await router.methods
        .swapETHForExactTokens(
          web3.utils.toWei(swap_amount),
          [WETH_ADDRESS, Sushi.networks[id].address],
          addresses[3],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({
          from: addresses[3],
          gas: gas,
          value: web3.utils.toWei("1"),
        });
      console.log("Done SWAP (EWT-SUSHI)");
      const balanceTKA_after = await sushi.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });

      const postETHBal = await web3.eth.getBalance(addresses[1]);
      console.log(`ETH BALANCE (post): ${web3.utils.fromWei(postETHBal)} ETH`);
      console.log(`

      // PURCHASE Pair 1: (EWT - SUSHI)
-------------------------------------
    Purchaser ADD[3] TKA Balance (after): ${web3.utils.fromWei(
      balanceTKA_after
    )} SUSHI
    `);

      console.log("✅ Could make all SWAPS");
    } catch (e) {
      console.log("ERROR: When trying SWAP EWT --> TKA");
      console.log(e);
    }
  }, 24 * 1000);
};

const testMasterChef = async () => {
  const web3 = new Web3("http://localhost:8545");

  //!wallet: Deployer

  // const wallet = new HDWalletProvider(
  //   [process.env.MNEMONIC],
  //   'https://rpc.energyweb.org',
  // )

  // const web3 = new Web3(wallet)

  //!wallet: Buyer

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const gas = new web3.utils.BN("6000000");

  const superBn = new web3.utils.BN(
    "10000000000000000000000000000000000000000"
  ); //? 10,000
  const bn = new web3.utils.BN("100000000000000000000000"); //? 10,000
  const bn2 = new web3.utils.BN("100000000000000000000"); //? 100

  //TODO: Smart Contracts Main Declaration

  const factory = new web3.eth.Contract(Factory.abi, FACTORY_ADDRESS);

  const router = new web3.eth.Contract(Router.abi, Router.networks[id].address);

  const tokenA = new web3.eth.Contract(tokenABI, TOKEN_A);
  const tokenB = new web3.eth.Contract(tokenABI, TOKEN_B);

  const sushi = new web3.eth.Contract(Sushi.abi, Sushi.networks[id].address);
  const sushiBar = new web3.eth.Contract(
    SushiBar.abi,
    SushiBar.networks[id].address
  );
  const sushiMaker = new web3.eth.Contract(
    SushiMaker.abi,
    SushiMaker.networks[id].address
  );

  const sushiRestaurant = new web3.eth.Contract(
    SushiRestaurant.abi,
    SushiRestaurant.networks[id].address
  );

  const masterChef = new web3.eth.Contract(
    MasterChef.abi,
    MasterChef.networks[id].address
  );

  const wewt = new web3.eth.Contract(WETH.abi, WETH_ADDRESS);

  let llp_tokenA_tokenB;

  try {
    const sushiBal = await sushi.methods.balanceOf(addresses[2]).call();

    const owner = await sushi.methods.owner().call();

    await sushi.methods.mint(addresses[2], superBn).send({
      from: owner,
      gas: gas,
    });

    await sushi.methods.mint(addresses[2], bn).send({
      from: owner,
      gas: gas,
    });

    await sushi.methods
      .transferOwnership(MasterChef.networks[id].address)
      .send({
        from: owner,
        gas: gas,
      });

    const sushiBal_ = await sushi.methods.balanceOf(addresses[2]).call();

    console.log(`
    
    Could mint SUSHI to ADD[2]

    Pre_minting ADD[2]: ${web3.utils.fromWei(sushiBal)} SUSHI
    Post_minting ADD[2]: ${web3.utils.fromWei(sushiBal_)} SUSHI

    `);
  } catch (e) {
    console.log("ERROR: Miniting SUSHIs");
    console.log(e);
  }

  try {
    await factory.methods.setFeeTo(SushiMaker.networks[id].address).send({
      from: FACTORY_DEPLOYER_ADDRESS,
      gas: gas,
    });
    console.log("Could change FEE To SushiMaker");
  } catch (e) {
    console.log("⛔️ ERROR: While CHANGING FACTORY FEE --> SushiMaker");
    console.log(e);
  }

  try {
    //! Send TOKEN A and TOKEN B to ADD[2] to provide Liquidity

    const balTokenA2 = await tokenA.methods.balanceOf(addresses[0]).call();
    const balTokenB2 = await tokenB.methods.balanceOf(addresses[0]).call();
    const balTokenSushi = await sushi.methods.balanceOf(addresses[2]).call();

    console.log(balTokenA2);
    console.log(balTokenB2);
    console.log(balTokenSushi);

    await tokenA.methods.transfer(addresses[2], bn).send({
      from: addresses[0],
      gas: gas,
    });
    await tokenB.methods.transfer(addresses[2], bn).send({
      from: addresses[0],
      gas: gas,
    });

    // AQUI

    await sushi.methods.transfer(addresses[3], bn).send({
      from: addresses[2],
      gas: gas,
    });

    console.log(`Trying to transfer:
    
    ADD[2]: ${web3.utils.fromWei(balTokenSushi)} SUSHI to ADD[3]
    
    
    `);
  } catch (e) {
    console.log("ERROR: While sending Token A and Token B");
    console.log(e);
  }

  try {
    const tsTokenA = await tokenA.methods.totalSupply().call();
    const tsTokenB = await tokenA.methods.totalSupply().call();
    const tsWewt = await wewt.methods.totalSupply().call();
    const tsSushi = await sushi.methods.totalSupply().call();

    console.log(`TS A: ${web3.utils.fromWei(tsTokenA)}`);
    console.log(`TS B: ${web3.utils.fromWei(tsTokenB)}`);
    console.log(`TS WEWT: ${web3.utils.fromWei(tsWewt)}`);
    console.log(`TS SUHSI: ${web3.utils.fromWei(tsSushi)}`);

    await tokenA.methods.approve(Router.networks[id].address, tsTokenA).send({
      from: addresses[2],
      gas: gas,
    });
    await tokenB.methods.approve(Router.networks[id].address, tsTokenB).send({
      from: addresses[2],
      gas: gas,
    });
    await sushi.methods.approve(Router.networks[id].address, tsSushi).send({
      from: addresses[2],
      gas: gas,
    });
    await sushi.methods.approve(MasterChef.networks[id].address, tsSushi).send({
      from: addresses[3],
      gas: gas,
    });

    console.log("SUSHI, TOKEN A , TOKEN B have been approved");
  } catch (e) {
    console.log("ERROR: While fetching Total Supply Data");
    console.log(e);
  }

  try {
    await router.methods
      .addLiquidityETH(
        Sushi.networks[id].address,
        web3.utils.toWei("100"),
        0,
        0,
        addresses[2],
        Math.floor(Date.now() / 1000) + 60 * 10
      )
      .send({
        from: addresses[2],
        gas: gas,
        value: web3.utils.toWei("10"),
      });

    console.log("Could ADD Liquidity ");
  } catch (e) {
    console.log("ERROR: Creating MasterChef for pair EWT-SUSHI");
    console.log(e);
  }

  setTimeout(async () => {
    try {
      const pairAddress = await factory.methods
        .getPair(WETH_ADDRESS, Sushi.networks[id].address)
        .call();

      await masterChef.methods.add(1, pairAddress, true).send({
        from: addresses[0],
        gas: gas,
      });

      console.log(`
    Created new FARM for EWT-SUSHI (${pairAddress})  
    `);
    } catch (e) {
      console.log("ERROR: Creating MasterChef for pair EWT-SUSHI");
      console.log(e);
    }
  }, 10 * 1000);

  setTimeout(async () => {
    try {
      const pairAddress = await factory.methods
        .getPair(WETH_ADDRESS, Sushi.networks[id].address)
        .call();

      const pair = new web3.eth.Contract(Pair.abi, pairAddress);

      const lp_amount = await pair.methods.balanceOf(addresses[2]).call();

      console.log(`USER has: ${web3.utils.fromWei(lp_amount)} LP to deposit`);

      await pair.methods.approve(MasterChef.networks[id].address, bn).send({
        from: addresses[2],
        gas: gas,
      });

      await masterChef.methods.deposit(0, lp_amount).send({
        from: addresses[2],
        gas: gas,
      });

      console.log("Could Deposit on Master Chef PoolId: 0");
    } catch (e) {
      console.log("ERROR: Depositing to MasterChef for pair EWT-SUSHI");
      console.log(e);
    }
  }, 15 * 1000);

  setTimeout(async () => {
    let pdtReward = await masterChef.methods
      .pendingSushi(0, addresses[2])
      .call();
    try {
      await web3.eth.sendTransaction({
        from: addresses[5],
        to: addresses[6],
        value: web3.utils.toWei("1"),
        gas: gas,
      });
      await masterChef.methods.pendingSushi(0, addresses[2]).call();
      console.log(`Pdt Reward: ${web3.utils.fromWei(pdtReward)}`);

      await web3.eth.sendTransaction({
        from: addresses[5],
        to: addresses[6],
        value: web3.utils.toWei("1"),
        gas: gas,
      });
      await masterChef.methods.pendingSushi(0, addresses[2]).call();
      console.log(`Pdt Reward: ${web3.utils.fromWei(pdtReward)}`);

      await web3.eth.sendTransaction({
        from: addresses[6],
        to: addresses[5],
        value: web3.utils.toWei("1"),
        gas: gas,
      });
      await masterChef.methods.pendingSushi(0, addresses[2]).call();
      console.log(`Pdt Reward: ${web3.utils.fromWei(pdtReward)}`);

      await web3.eth.sendTransaction({
        from: addresses[6],
        to: addresses[5],
        value: web3.utils.toWei("1"),
        gas: gas,
      });
      await masterChef.methods.pendingSushi(0, addresses[2]).call();
      console.log(`Pdt Reward: ${web3.utils.fromWei(pdtReward)}`);

      console.log("Done some Tx === Blocks advance");
    } catch (e) {
      console.log("ERROR: Making Tx or Fetching Pdt. Rewards");
      console.log(e);
    }
  }, 17 * 1000);
  setTimeout(async () => {
    let pdtReward = await masterChef.methods
      .pendingSushi(0, addresses[2])
      .call();
    console.log(`Pdt Reward: ${web3.utils.fromWei(pdtReward)}`);

    try {
      await web3.eth.sendTransaction({
        from: addresses[5],
        to: addresses[6],
        value: web3.utils.toWei("1"),
        gas: gas,
      });
      await masterChef.methods.pendingSushi(0, addresses[2]).call();
      console.log(`Pdt Reward: ${web3.utils.fromWei(pdtReward)}`);

      await web3.eth.sendTransaction({
        from: addresses[5],
        to: addresses[6],
        value: web3.utils.toWei("1"),
        gas: gas,
      });
      await masterChef.methods.pendingSushi(0, addresses[2]).call();
      console.log(`Pdt Reward: ${web3.utils.fromWei(pdtReward)}`);

      await web3.eth.sendTransaction({
        from: addresses[6],
        to: addresses[5],
        value: web3.utils.toWei("1"),
        gas: gas,
      });
      await masterChef.methods.pendingSushi(0, addresses[2]).call();
      console.log(`Pdt Reward: ${web3.utils.fromWei(pdtReward)}`);

      await web3.eth.sendTransaction({
        from: addresses[6],
        to: addresses[5],
        value: web3.utils.toWei("1"),
        gas: gas,
      });
      await masterChef.methods.pendingSushi(0, addresses[2]).call();
      console.log(`Pdt Reward: ${web3.utils.fromWei(pdtReward)}`);

      console.log("Done some Tx === Blocks advance");
    } catch (e) {
      console.log("ERROR: Making Tx or Fetching Pdt. Rewards");
      console.log(e);
    }
  }, 19 * 1000);

  setTimeout(async () => {
    try {
      const pairAddress = await factory.methods
        .getPair(WETH_ADDRESS, Sushi.networks[id].address)
        .call();
      const pair = new web3.eth.Contract(tokenABI, pairAddress);

      const beforeWith = await pair.methods.balanceOf(addresses[2]).call();
      const sushi_beforeWith = await sushi.methods
        .balanceOf(addresses[2])
        .call();

      console.log(`BEFORE WITHDRAWING MC:
      
        USER ADD[2]: ${web3.utils.fromWei(beforeWith)} LP
        USER ADD[2]: ${web3.utils.fromWei(sushi_beforeWith)} SUSHI
      
      `);

      const userInfo = await masterChef.methods.userInfo(0, addresses[2]).call({
        from: addresses[2],
      });

      console.log(userInfo.amount);

      // await masterChef.methods.updatePool(0).send({
      //   from: addresses[0],
      //   gas: gas,
      // })

      console.log("MC Pools Updated");
      await masterChef.methods.withdraw(0, userInfo.amount).send({
        from: addresses[2],
        gas: gas,
      });

      console.log("Could withdraw LP from Master Chef");
    } catch (e) {
      console.log("ERROR: Withdrawing LP from Master Chef");
      console.log(e);
    }
  }, 22 * 1000);

  setTimeout(async () => {
    try {
      const pairAddress = await factory.methods
        .getPair(WETH_ADDRESS, Sushi.networks[id].address)
        .call();
      const pair = new web3.eth.Contract(tokenABI, pairAddress);

      const afterWith = await pair.methods.balanceOf(addresses[2]).call();
      const sushi_afterWith = await sushi.methods
        .balanceOf(addresses[2])
        .call();
      console.log(`AFTER WITHDRAWING MC:
      
        USER ADD[2]: ${web3.utils.fromWei(afterWith)} LP
        USER ADD[2]: ${web3.utils.fromWei(sushi_afterWith)} SUSHI
      
      `);
    } catch (e) {
      console.log("ERROR: Printing user post MC Data");
      console.log(e);
    }
  }, 24 * 1000);
};

const sendTokensToFrontEndTester = async () => {
  // const web3 = new Web3('http://localhost:8545')

  //!wallet: Deployer

  const wallet = new HDWalletProvider(
    [process.env.MNEMONIC],
    "https://rpc.energyweb.org"
  );

  const web3 = new Web3(wallet);

  //!wallet: Buyer

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const address2Receive = "0x2E662795ae32b669c7A62887D6BA0B0ceE351Ca0";

  const gas = new web3.utils.BN("6000000");

  const superBn = new web3.utils.BN(
    "10000000000000000000000000000000000000000"
  ); //? 10,000
  const bn = new web3.utils.BN("100000000000000000000000"); //? 10,000
  const bn2 = new web3.utils.BN("100000000000000000000"); //? 100

  //TODO: Smart Contracts Main Declaration

  const factory = new web3.eth.Contract(Factory.abi, FACTORY_ADDRESS);

  const tokenA = new web3.eth.Contract(tokenABI, TOKEN_A);
  const tokenB = new web3.eth.Contract(tokenABI, TOKEN_B);

  // const sushi = new web3.eth.Contract(Sushi.abi, Sushi.networks[id].address)

  const wewt = new web3.eth.Contract(WETH.abi, WETH_ADDRESS);

  let llp_tokenA_tokenB;

  //TODO: Smart Contracts Main Declaration

  try {
    // const sushiBal = await sushi.methods.balanceOf(addresses[2]).call()

    // const owner = await sushi.methods.owner().call()

    // // await sushi.methods.mint(address2Receive, superBn).send({
    // //   from: owner,
    // //   gas: gas,
    // // })

    // await sushi.methods.mint(address2Receive, bn).send({
    //   from: owner,
    //   gas: gas,
    // })

    const bala = await tokenA.methods.balanceOf(addresses[0]).call();
    const balb = await tokenB.methods.balanceOf(addresses[0]).call();

    // console.log(bala)
    console.log(bala);
    console.log(balb);

    await tokenA.methods.transfer(address2Receive, bala).send({
      from: addresses[0],
      gas: gas,
    });
    await tokenB.methods.transfer(address2Receive, balb).send({
      from: addresses[0],
      gas: gas,
    });
  } catch (e) {
    console.log("ERROR: Miniting SUSHIs");
    console.log(e);
  }
};

const sendLMDToRestaurant = async () => {
  const web3 = new Web3("http://localhost:8545");

  //!wallet: Deployer

  // const wallet = new HDWalletProvider(
  //   [process.env.MNEMONIC],
  //   'https://rpc.energyweb.org',
  // )

  // const web3 = new Web3(wallet)

  //!wallet: Buyer

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const address2Receive = "0x858B83d9f8704867AA111109581f63ee8F4bFc89";

  const gas = new web3.utils.BN("6000000");

  const superBn = new web3.utils.BN(
    "10000000000000000000000000000000000000000"
  ); //? 10,000
  const bn = new web3.utils.BN("100000000000000000000000"); //? 10,000
  const bn2 = new web3.utils.BN("100000000000000000000"); //? 100

  //TODO: Smart Contracts Main Declaration

  const factory = new web3.eth.Contract(Factory.abi, FACTORY_ADDRESS);

  const tokenA = new web3.eth.Contract(tokenABI, TOKEN_A);
  const tokenB = new web3.eth.Contract(tokenABI, TOKEN_B);

  const sushi = new web3.eth.Contract(Sushi.abi, Sushi.networks[id].address);

  const wewt = new web3.eth.Contract(WETH.abi, WETH_ADDRESS);

  let llp_tokenA_tokenB;

  //TODO: Smart Contracts Main Declaration

  try {
    const owner = await sushi.methods.owner().call();

    await sushi.methods
      .approve(SushiRestaurant.networks[id].address, superBn)
      .send({
        from: addresses[2],
        gas: gas,
      });

    await sushi.methods.mint(addresses[2], superBn).send({
      from: owner,
      gas: gas,
    });

    await sushi.methods
      .mint(SushiRestaurant.networks[id].address, superBn)
      .send({
        from: owner,
        gas: gas,
      });
  } catch (e) {
    console.log("ERROR: Miniting SUSHIs");
    console.log(e);
  }
};

const sendETHToMetamask = async () => {
  const web3 = new Web3("http://localhost:8545");

  //!wallet: Deployer

  // const wallet = new HDWalletProvider(
  //   [process.env.MNEMONIC],
  //   'https://rpc.energyweb.org',
  // )

  // const web3 = new Web3(wallet)

  //!wallet: Buyer

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const address2Receive = "0x858B83d9f8704867AA111109581f63ee8F4bFc89";

  const gas = new web3.utils.BN("6000000");

  //TODO: Smart Contracts Main Declaration

  await web3.eth.sendTransaction({
    from: addresses[5],
    to: address2Receive,
    value: web3.utils.toWei("30"),
    gas: gas,
  });
};

const transferSushiOwnership = async () => {
  // const web3 = new Web3('http://localhost:8545')

  //!wallet: Deployer

  const wallet = new HDWalletProvider(
    [process.env.MNEMONIC],
    "https://rpc.energyweb.org"
  );

  const web3 = new Web3(wallet);

  //!wallet: Buyer

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const gas = new web3.utils.BN("6000000");

  //TODO: Smart Contracts Main Declaration

  // const sushiRestaurant = new web3.eth.Contract(
  //   SushiRestaurant.abi,
  //   SushiRestaurant.networks[id].address,
  // )

  const sushi = new web3.eth.Contract(Sushi.abi, SUSHI_ADDRESS);

  // const owner = await sushi.methods.owner().call()

  // console.log(owner)

  // console.log(MasterChef.networks[id].address)
  try {
    await sushi.methods
      .transferOwnership(MasterChef.networks[id].address)
      .send({
        from: addresses[0],
        gas: gas,
      });
    console.log(`

  🔥 🔥 CHANGED LMD Ownership 🔥 🔥 🔥

  `);
  } catch (e) {
    console.log(e);
  }
};

const checkMCLength = async () => {
  const wallet = new HDWalletProvider(
    [process.env.MNEMONIC],
    "https://rpc.energyweb.org"
  );

  const web3 = new Web3(wallet);

  //!wallet: Buyer

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const address2Receive = "0x858B83d9f8704867AA111109581f63ee8F4bFc89";

  const gas = new web3.utils.BN("6000000");

  const masterChef = new web3.eth.Contract(MasterChef.abi, MASTERCHEF_ADDRESS);
  const factory = new web3.eth.Contract(Factory.abi, FACTORY_ADDRESS);

  //TODO: Smart Contracts Main Declaration

  try {
    const length = await masterChef.methods
      .poolLength()
      .call({ from: addresses[0] });
    console.log(length);
  } catch (e) {
    console.log(e);
  }
};

const createPairOnFactory = async () => {
  const wallet = new HDWalletProvider(
    [process.env.MNEMONIC],
    "https://rpc.energyweb.org"
  );

  const web3 = new Web3(wallet);

  //!wallet: Buyer

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const address2Receive = "0x858B83d9f8704867AA111109581f63ee8F4bFc89";

  const gas = new web3.utils.BN("6000000");

  const factory = new web3.eth.Contract(Factory.abi, FACTORY_ADDRESS);
  try {
    await factory.methods
      .createPair(TOKEN_A, SUSHI_ADDRESS)
      .send({ from: addresses[0], gas: gas });
    console.log("Pair TKA - SUSHI Created");
    await factory.methods
      .createPair(SUSHI_ADDRESS, WETH_ADDRESS)
      .send({ from: addresses[0], gas: gas });
    console.log("Pair SUSHI_ADDRESS - WETH_ADDRESS Created");
    await factory.methods
      .createPair(TOKEN_A, WETH_ADDRESS)
      .send({ from: addresses[0], gas: gas });
    console.log("Pair TKA - WETH_ADDRESS Created");
  } catch (e) {
    console.log("Could not create all pairs");
    console.log(e);
  }
};

const createMasterChefPools = async () => {
  // const web3 = new Web3('http://localhost:8545')

  //!wallet: Deployer

  const wallet = new HDWalletProvider(
    [process.env.MNEMONIC],
    "https://rpc.energyweb.org"
  );

  const web3 = new Web3(wallet);

  //!wallet: Buyer

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const gas = new web3.utils.BN("6000000");

  const masterChef = new web3.eth.Contract(MasterChef.abi, MASTERCHEF_ADDRESS);
  const factory = new web3.eth.Contract(Factory.abi, FACTORY_ADDRESS);

  //TODO: Smart Contracts Main Declaration

  try {
    // const length = await masterChef.methods.poolLength().call()
    // console.log(length)
    // console.log(length)
    // console.log(length)
    // console.log(length)
    const pairAddress0 = await factory.methods
      .getPair("0xdBB49BE8562ca6E23B41B3BC7f76b00748EED557", SUSHI_ADDRESS)
      .call();
    console.log(pairAddress0);

    const pairAddress1 = await factory.methods
      .getPair(WETH_ADDRESS, SUSHI_ADDRESS)
      .call();
    console.log(pairAddress1);

    const pairAddress2 = await factory.methods
      .getPair("0xdBB49BE8562ca6E23B41B3BC7f76b00748EED557", WETH_ADDRESS)
      .call();
    console.log(pairAddress2);

    console.log("Sushi", SUSHI_ADDRESS);

    //     await masterChef.methods.add(4, pairAddress0, true).send({
    //       from: addresses[0],
    //       gas: gas,
    //     })
    //     console.log(`
    //         Created new FARM on MASTERCHEF(${pairAddress0})  LMN - LMD
    //         `)
    //     await masterChef.methods.add(2, pairAddress1, false).send({
    //       from: addresses[0],
    //       gas: gas,
    //     })
    //     console.log(`
    //     Created new FARM on MASTERCHEF(${pairAddress1})  LMD - EWT
    //     `)

    //     await masterChef.methods.add(2, pairAddress2, false).send({
    //       from: addresses[0],
    //       gas: gas,
    //     })
    //     console.log(`
    //     Created new FARM on MASTERCHEF(${pairAddress2})  LMN - EWT
    //     `)

    //     await masterChef.methods.add(1, SUSHI_ADDRESS, false).send({
    //       from: addresses[0],
    //       gas: gas,
    //     })
    //     console.log(`
    // Created new POOL on MASTERCHEF(${SUSHI_ADDRESS})  LMD
    // `)

    console.log("05");
  } catch (e) {
    console.log("ERROR: Creating MasterChef for pair EWT-SUSHI");
    console.log(e);
  }
};

const addLiquiditySpecial = async () => {
  // const web3 = new Web3('http://localhost:8545')

  //!wallet: Deployer

  const wallet = new HDWalletProvider(
    [process.env.MNEMONIC],
    "https://rpc.energyweb.org"
  );

  const web3 = new Web3(wallet);

  //!wallet: Buyer

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const address2Receive = "0x858B83d9f8704867AA111109581f63ee8F4bFc89";

  const gas = new web3.utils.BN("6000000");

  const router = new web3.eth.Contract(Router.abi, ROUTER_ADDRESS);
  const factory = new web3.eth.Contract(Factory.abi, FACTORY_ADDRESS);

  //TODO: Smart Contracts Main Declaration

  try {
    const pairAddress0 = await factory.methods
      .getPair(TOKEN_A, SUSHI_ADDRESS)
      .call();

    // AQUI

    await router.methods
      .addLiquidity(
        TOKEN_A,
        SUSHI_ADDRESS,
        web3.utils.toWei("1000"),
        web3.utils.toWei("1000"),
        0,
        0,
        addresses[0],
        Math.floor(Date.now() / 1000) + 60 * 10
      )
      .send({ from: addresses[2], gas: gas });
    console.log("Added liquidity to TKA - TKB ");

    console.log(pairAddress0);

    const pairAddress1 = await factory.methods
      .getPair(WETH_ADDRESS, SUSHI_ADDRESS)
      .call();
    console.log(pairAddress1);

    const pairAddress2 = await factory.methods
      .getPair(TOKEN_A, WETH_ADDRESS)
      .call();
    console.log(pairAddress2);

    await masterChef.methods.add(4, pairAddress0, true).send({
      from: addresses[0],
      gas: gas,
    });
    console.log(`
        Created new FARM on MASTERCHEF(${pairAddress0})  LMN - LMD
        `);
    await masterChef.methods.add(2, pairAddress1, false).send({
      from: addresses[0],
      gas: gas,
    });
    console.log(`
    Created new FARM on MASTERCHEF(${pairAddress1})  LMD - EWT
    `);

    await masterChef.methods.add(2, pairAddress2, false).send({
      from: addresses[0],
      gas: gas,
    });
    console.log(`
    Created new FARM on MASTERCHEF(${pairAddress2})  LMN - EWT
    `);

    await masterChef.methods.add(1, SUSHI_ADDRESS, false).send({
      from: addresses[0],
      gas: gas,
    });
    console.log(`
Created new POOL on MASTERCHEF(${SUSHI_ADDRESS})  LMD
`);

    console.log("05");
  } catch (e) {
    console.log("ERROR: Creating MasterChef for pair EWT-SUSHI");
    console.log(e);
  }
};

const lemonade_setFeeTo = async (feeTo) => {
  const wallet = new HDWalletProvider(
    [process.env.MNEMONIC],
    "https://rpc.energyweb.org"
  );

  const web3 = new Web3(wallet);

  //!wallet: Buyer

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const gas = new web3.utils.BN("6000000");

  const factory = new web3.eth.Contract(Factory.abi, FACTORY_ADDRESS);

  try {
    await factory.methods.setFeeTo(feeTo).send({
      from: addresses[0],
      gas: gas,
    });
    console.log(`Could Set Fee To: ${feeTo}`);
  } catch (e) {
    console.log("Error: Setting Fee to");
    console.log(e);
  }
};

const getFactoryCodeHash = async () => {
  const web3 = new Web3("http://localhost:8545");

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const factory = new web3.eth.Contract(
    Factory.abi,
    Factory.networks[id].address
  );

  //TODO: Smart Contracts Main Declaration

  try {
    const init_code_hash = await factory.methods.pairCodeHash().call();

    console.log("Factory Init Code Hash: " + init_code_hash);
    // AQUI
  } catch (e) {
    console.log(e);
    console.log("Something occured while fetching  INIT:CODE:HASH");
  }
};

const createPairOnXdYeFactory = async () => {
  const web3 = new Web3("http://localhost:8545");

  const id = await web3.eth.net.getId();

  const addresses = await web3.eth.getAccounts();

  const gas = new web3.utils.BN("6000000");

  const factory = new web3.eth.Contract(
    Factory.abi,
    Factory.networks[id].address
  );

  try {
    await factory.methods
      .createPair(TokenA.networks[id].address, XdYe.networks[id].address)
      .send({ from: addresses[0], gas: gas });
    console.log("Pair ToKen A - XdYe Created");
    await factory.methods
      .createPair(XdYe.networks[id].address, WETH.networks[id].address)
      .send({ from: addresses[0], gas: gas });
    console.log("Pair XdYe - WETH Created");
    await factory.methods
      .createPair(TokenA.networks[id].address, WETH.networks[id].address)
      .send({ from: addresses[0], gas: gas });
    console.log("Pair ToKen A - WETH Created");
  } catch (e) {
    console.log("Could not create pairs");
    console.log(e);
  }
};

const checkFactoryFeesEdit = async () => {
  const web3 = new Web3("http://localhost:8545");

  const id = await web3.eth.net.getId();

  const addresses = await web3.eth.getAccounts();

  const gas = new web3.utils.BN("6000000");

  const factory = new web3.eth.Contract(
    Factory.abi,
    Factory.networks[id].address
  );

  //? Start state
  //?   addresses[0] is feeToSetter
  //?   addresses[0] is feeTo

  try {
    //?   addresses[0] is feeToSetter
    await factory.methods
      .setFeeTo(addresses[1])
      .send({ from: addresses[0], gas: gas });

    console.log("Fees will be delivered to AD[1]");

    //? State 1
    //?   addresses[0] is feeToSetter
    //?   addresses[1] is feeTo

    await factory.methods
      .setFeeToSetter(addresses[1])
      .send({ from: addresses[0], gas: gas });

    console.log("Fees will be delivered to AD[1]");

    //? State 2
    //?   addresses[1] is feeToSetter
    //?   addresses[1] is feeTo

    //! Now addresses[0] can not change any information from XdYeFactory and neither receive LPs from XdYe Profits
  } catch (e) {
    console.log("Could not modify FeeTo or SetFeeToSetter pairs");
    console.log(e);
  }
};

//! Start Here
const addAndRemoveLiquidity = async () => {
  const web3 = new Web3("http://localhost:8545");

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const gas = new web3.utils.BN("6000000");

  const bn = new web3.utils.BN("100000000000000000000000"); //? 10,000
  const bn2 = new web3.utils.BN("10000000000000000000"); //? 100

  const factory = new web3.eth.Contract(
    Factory.abi,
    Factory.networks[id].address
  );

  const router = new web3.eth.Contract(Router.abi, Router.networks[id].address);

  const tokenA = new web3.eth.Contract(tokenABI, TokenA.networks[id].address);
  const tokenB = new web3.eth.Contract(tokenABI, TokenB.networks[id].address);

  const wETH = new web3.eth.Contract(WETH.abi, WETH.networks[id].address);

  let llp_tokenA_tokenB;

  try {
    //! Send TOKEN A and TOKEN B to ADD[2] so it can provide Liquidity

    const balTokenA2 = await tokenA.methods.balanceOf(addresses[0]).call();
    const balTokenB2 = await tokenB.methods.balanceOf(addresses[0]).call();

    await tokenA.methods.transfer(addresses[2], bn).send({
      from: addresses[0],
      gas: gas,
    });
    await tokenB.methods.transfer(addresses[2], bn).send({
      from: addresses[0],
      gas: gas,
    });

    const preAddLiquidityTokenA = await tokenA.methods
      .balanceOf(addresses[2])
      .call();
    const preAddLiquidityTokenB = await tokenB.methods
      .balanceOf(addresses[2])
      .call();

    console.log(`

    Balances PRE - ADDING LIQUIDITY

ADD[2]: ${web3.utils.fromWei(preAddLiquidityTokenA)} TKA
ADD[2]: ${web3.utils.fromWei(preAddLiquidityTokenB)} TKB

`);
  } catch (e) {
    console.log("ERROR: While sending Token A and Token B");
    console.log(e);
  }

  //! Approving Router to spend Token A and Token B from addresses[2]
  setTimeout(async () => {
    try {
      await tokenA.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[2],
          gas: gas,
        });
      await tokenB.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[2],
          gas: gas,
        });

      console.log("TOKEN A , TOKEN B have been approved");
    } catch (e) {
      console.log("ERROR: While Approving TKA & TKB for ADD[2]");
      console.log(e);
    }
  });

  //! Creating a Pair through Router with addLiquidity
  setTimeout(async () => {
    try {
      await router.methods
        .addLiquidityETH(
          TokenA.networks[id].address,
          web3.utils.toWei("10000"),
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas, value: web3.utils.toWei("10") });
      console.log("Added liquidity to WETH - TKA ");

      let lp_add_ = await factory.methods
        .getPair(WETH.networks[id].address, TokenA.networks[id].address)
        .call();

      const swapPair_ = new web3.eth.Contract(Pair.abi, lp_add_);

      const some = await swapPair_.methods.getReserves().call();
      const lastK = await swapPair_.methods.kLast().call();

      const rootk = Math.sqrt(some[0] * some[1]);
      const rootklast = Math.sqrt(lastK);

      console.log(`
      Pair wETH - A:

      Reserve0 = ${web3.utils.fromWei(some[0])}
      Reserve1 = ${web3.utils.fromWei(some[1])}

      rootK     =  ${rootk}
      rootKLast =  ${rootklast}
      `);

      await router.methods
        .addLiquidityETH(
          TokenB.networks[id].address,
          web3.utils.toWei("10000"),
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas, value: web3.utils.toWei("30") });
      console.log("Added liquidity to WETH - TKB ");

      await router.methods
        .addLiquidity(
          TokenA.networks[id].address,
          TokenB.networks[id].address,
          web3.utils.toWei("1000"),
          web3.utils.toWei("1000"),
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas });
      console.log("Added liquidity to TKA - TKB ");

      const postAddLiquidityTokenA = await tokenA.methods
        .balanceOf(addresses[2])
        .call();
      const postAddLiquidityTokenB = await tokenB.methods
        .balanceOf(addresses[2])
        .call();

      console.log(`

      Balances POST - ADDING LIQUIDITY

ADD[2]: ${web3.utils.fromWei(postAddLiquidityTokenA)} TKA
ADD[2]: ${web3.utils.fromWei(postAddLiquidityTokenB)} TKB

`);

      const llp_WETH_A = await factory.methods
        .getPair(WETH.networks[id].address, TokenA.networks[id].address)
        .call();

      const pair = new web3.eth.Contract(Pair.abi, llp_WETH_A);

      const add2balanceLP = await pair.methods.balanceOf(addresses[2]).call();
      console.log("ADDRESS_2 LPs (wETH - A) in WEI format", add2balanceLP);
      console.log(
        "ADDRESS_2 LPs (wETH - A) NO WEI format",
        web3.utils.fromWei(add2balanceLP)
      );

      // console.log(dataReturnedAddLiquidity)
    } catch (e) {
      console.log("ERROR: While Adding Liquidity to PAIR (A-B)");
      console.log(e);
    }
  }, 10 * 1000);

  //! Get Reserve INFORMATION
  setTimeout(async () => {
    try {
      lp_weth_tka = await factory.methods
        .getPair(WETH.networks[id].address, TokenA.networks[id].address)
        .call();
      console.log(`WETH - Token A LP address: ${lp_weth_tka}`);
      const pair = new web3.eth.Contract(Pair.abi, lp_weth_tka);
      const token0 = await pair.methods.token0().call();
      const token1 = await pair.methods.token1().call();

      console.log(`
      Pair Information: (wETH-TKA)

      Token 0: ${token0}
      Token 1: ${token1}
      `);

      const reserve = await pair.methods.getReserves().call();

      console.log(`
      Reserves on Pair wETH - Token B:

      Reserve Token 0: ${web3.utils.fromWei(reserve._reserve0)}
      Reserve Token 1: ${web3.utils.fromWei(reserve._reserve1)}
      `);

      lp_weth_tkb = await factory.methods
        .getPair(WETH.networks[id].address, TokenB.networks[id].address)
        .call();
      console.log(`EWT - Token B LP address: ${lp_weth_tkb}`);
      const _pair = new web3.eth.Contract(Pair.abi, lp_weth_tkb);
      const _token0 = await _pair.methods.token0().call();
      const _token1 = await _pair.methods.token1().call();

      console.log(`

      Pair Information: (wETH-TKB)

      Token 0: ${_token0}
      Token 1: ${_token1}
      `);

      const _reserve = await _pair.methods.getReserves().call();

      console.log(`
      Reserves on Pair wETH - Token B:

      Reserve Token 0: ${web3.utils.fromWei(_reserve._reserve0)}
      Reserve Token 1: ${web3.utils.fromWei(_reserve._reserve1)}
      `);

      lp_tka_tkb = await factory.methods
        .getPair(TokenA.networks[id].address, TokenB.networks[id].address)
        .call();
      console.log(`Token A - Token B LP address: ${lp_tka_tkb}`);
      const __pair = new web3.eth.Contract(Pair.abi, lp_tka_tkb);
      const __token0 = await __pair.methods.token0().call();
      const __token1 = await __pair.methods.token1().call();

      console.log(`
      Pair Information: (TKA-TKB)

      Token 0: ${__token0}
      Token 1: ${__token1}
      `);

      const __reserve = await __pair.methods.getReserves().call();

      console.log(`
      Reserves on Pair Token A - Token B:

      Reserve Token 0: ${web3.utils.fromWei(__reserve._reserve0)}
      Reserve Token 1: ${web3.utils.fromWei(__reserve._reserve1)}
      `);
    } catch (e) {
      console.log("ERROR: While Getting Pair Data");
      console.log(e);
    }
  }, 20 * 1000);

  //* SWAP ETH --> TKA (1)
  setTimeout(async () => {
    try {
      const amountOut_ETH_TKA = await router.methods
        .getAmountsOut(web3.utils.toWei("10"), [
          WETH.networks[id].address,
          TokenA.networks[id].address,
        ])
        .call({ from: addresses[3] });
      console.log(
        "I am swaping: ",
        web3.utils.fromWei(amountOut_ETH_TKA[0]),
        "wETH",
        WETH_ADDRESS
      );
      console.log("I will get: ", web3.utils.fromWei(amountOut_ETH_TKA[1]));

      const amountOut_ETH_TKA_min = web3.utils.fromWei(amountOut_ETH_TKA[1]);

      console.log("Or a MINIMUM : ", amountOut_ETH_TKA_min, "TKA");

      const balanceTKA_before = await tokenA.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });
      console.log(`
        Purchaser ADD[3] TKA Balance (before): ${web3.utils.fromWei(
          balanceTKA_before
        )} TKA
            `);

      const swap_amount = amountOut_ETH_TKA_min.toString();

      const preETHBal = await web3.eth.getBalance(addresses[3]);
      console.log(`ETH BALANCE (before): ${web3.utils.fromWei(preETHBal)} ETH`);
      console.log("Preparing swap ETH --> TKA");
      console.log(" ");
      console.log("SWAP_0");
      console.log(" ");

      await router.methods
        .swapETHForExactTokens(
          web3.utils.toWei(swap_amount),
          [WETH.networks[id].address, TokenA.networks[id].address],
          addresses[3],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({
          from: addresses[3],
          gas: gas,
          value: web3.utils.toWei("10"),
        });
      const balanceTKA_after = await tokenA.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });

      const postETHBal = await web3.eth.getBalance(addresses[3]);
      console.log(`ETH BALANCE (post): ${web3.utils.fromWei(postETHBal)} ETH`);
      console.log(`
        Trade INFO: For 10 ETH
        
        Purchaser ADD[3] TKA Balance (after): ${web3.utils.fromWei(
          balanceTKA_after
        )} TKA
          `);
      console.log("Done SWAP (ETH-TKA)");

      let lp_add_ = await factory.methods
        .getPair(WETH.networks[id].address, TokenA.networks[id].address)
        .call();

      const swapPair_ = new web3.eth.Contract(Pair.abi, lp_add_);

      const some = await swapPair_.methods.getReserves().call();
      const lastK = await swapPair_.methods.kLast().call();

      const rootk = Math.sqrt(some[0] * some[1]);
      const rootklast = Math.sqrt(lastK);

      console.log(`
    Pair ETH - Token A: (post trade)

    Reserve0 = ${web3.utils.fromWei(some[0])}
    Reserve1 = ${web3.utils.fromWei(some[1])}

    rootK     =  ${rootk}
    rootKLast =  ${rootklast}
    `);

      let lp_add = await factory.methods
        .getPair(WETH.networks[id].address, TokenA.networks[id].address)
        .call();

      const swapPair = new web3.eth.Contract(Pair.abi, lp_add);

      const kLast = await swapPair.methods.kLast().call();

      console.log(`
      After SWAP, Pair ETH-TKA kLast --> ${kLast}
    `);
    } catch (e) {
      console.log("ERROR: When trying SWAP ETH --> TKA");
      console.log(e);
    }
  }, 21 * 1000);

  //* SWAP TKA --> TKB (2)
  setTimeout(async () => {
    try {
      const tka_balance_init = await tokenA.methods
        .balanceOf(addresses[3])
        .call();

      const tkb_balance_init = await tokenB.methods
        .balanceOf(addresses[3])
        .call();

      const amountOut_TKA_TKB = await router.methods
        .getAmountsOut(tka_balance_init, [
          TokenA.networks[id].address,
          TokenB.networks[id].address,
        ])
        .call({ from: addresses[3] });

      const amountOut_TKA_TKB_min =
        web3.utils.fromWei(amountOut_TKA_TKB[1]) * 0.8;

      await tokenA.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[3],
          gas: gas,
        });

      await router.methods
        .swapTokensForExactTokens(
          amountOut_TKA_TKB[1],
          tka_balance_init,
          [TokenA.networks[id].address, TokenB.networks[id].address],
          addresses[3],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({
          from: addresses[3],
          gas: gas,
        });

      console.log("SWAP_1");

      const balanceTKB_after = await tokenB.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });
      const balanceTKA_after = await tokenA.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });

      console.log(`
        
        SUMMARY: Trading TKA --> TKB

          TKA Balance (pre): ${web3.utils.fromWei(tka_balance_init)} TKA
          TKB Balance (pre): ${web3.utils.fromWei(tkb_balance_init)} TKB

          After Trading
          -------------

          TKA Balance (post): ${web3.utils.fromWei(balanceTKA_after)} TKA
          TKB Balance (post): ${web3.utils.fromWei(balanceTKB_after)} TKB
          
        
        
        
        `);

      let lp_add_ = await factory.methods
        .getPair(TokenA.networks[id].address, TokenB.networks[id].address)
        .call();

      const swapPair_ = new web3.eth.Contract(Pair.abi, lp_add_);

      const some = await swapPair_.methods.getReserves().call();
      const lastK = await swapPair_.methods.kLast().call();

      const rootk = Math.sqrt(some[0] * some[1]);
      const rootklast = Math.sqrt(lastK);

      console.log(`
    Pair A - B:

    Reserve0 = ${web3.utils.fromWei(some[0])}
    Reserve1 = ${web3.utils.fromWei(some[1])}

    rootK     =  ${rootk}
    rootKLast =  ${rootklast}
    `);
    } catch (e) {
      console.log("ERROR: When trying SWAP TKA --> TKB");
      console.log(e);
    }
  }, 26 * 1000);

  //

  setTimeout(async () => {
    //! Remove Liquidity (because TradingFees are minted when user ADDs/Withdraws Liquidity)

    try {
      const llp_WETH_A = await factory.methods
        .getPair(WETH.networks[id].address, TokenA.networks[id].address)
        .call();

      console.log(`Removing Liquidity of: ${llp_WETH_A}`);

      const token_llp = new web3.eth.Contract(UniswapV2ERC20.abi, llp_WETH_A);

      const user_balance_token_llp = await token_llp.methods
        .balanceOf(addresses[2])
        .call();

      const pair_eth_a = new web3.eth.Contract(Pair.abi, llp_WETH_A);

      const pairData = await pair_eth_a.methods.getReserves().call();
      console.log(`
    Pair Data:
      - Token0 (${web3.utils.fromWei(pairData._reserve0)})  
      - Token1 (${web3.utils.fromWei(pairData._reserve1)})

    `);

      console.log(`
    ADD[3] has ${web3.utils.fromWei(user_balance_token_llp)} (ETH - A) LP 
    `);

      const balanceToken0 = await tokenA.methods.balanceOf(llp_WETH_A).call();
      const balanceToken1 = await wETH.methods.balanceOf(llp_WETH_A).call();

      const balance = await pair_eth_a.methods.balanceOf(addresses[2]).call();
      const _balance = await token_llp.methods.balanceOf(addresses[2]).call();

      const totalS = await pair_eth_a.methods.totalSupply().call();

      let withAmount = web3.utils.fromWei(_balance) * 0.5;

      console.log(
        "Amount to withdraw No Wei: ",
        withAmount,
        " LP (50%  of deposited LPs)"
      );

      const bnRemove = "100";

      const approved = await pair_eth_a.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[2],
          gas: gas,
        });

      console.log('Approved ETH-TKA LP "manipulation"');

      amount = web3.utils.toWei(withAmount.toString(), "ether");

      await router.methods
        .removeLiquidityETH(
          TokenA.networks[id].address,
          amount,
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas });

      console.log("Could Remove (50%) Liquidity ETH-TKA");

      const endBal = await token_llp.methods.balanceOf(addresses[2]).call();
      console.log(`User has: ${web3.utils.fromWei(endBal)} EWT-TKA LP`);
      console.log(`
      
      `);
    } catch (e) {
      console.log("ERROR: Removing Liquidity");
      console.log(e);
    }
  }, 35 * 1000);
};

const checkETHWrapAndUnwrap = async () => {
  const web3 = new Web3("http://localhost:8545");

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const wETHContract = new web3.eth.Contract(
    WETH.abi,
    WETH.networks[id].address
  );

  try {
    const balanceWETHPre = await wETHContract.methods
      .balanceOf(addresses[0])
      .call();

    console.log(`
    
    Balance Pre Wrap:

    ADD[0]: ${web3.utils.fromWei(balanceWETHPre)} wETH
    
    `);

    await wETHContract.methods
      .deposit()
      .send({ from: addresses[0], value: web3.utils.toWei("10") });

    const balanceWETHPostWrap = await wETHContract.methods
      .balanceOf(addresses[0])
      .call();

    console.log(`
    
    Balance Post Wrap:

    ADD[0]: ${web3.utils.fromWei(balanceWETHPostWrap)} wETH
    
    `);

    await wETHContract.methods
      .withdraw(balanceWETHPostWrap)
      .send({ from: addresses[0] });

    const balanceWETHPostUnWrap = await wETHContract.methods
      .balanceOf(addresses[0])
      .call();

    console.log(`
  
  Balance Post UnWrap:

  ADD[0]: ${web3.utils.fromWei(balanceWETHPostUnWrap)} wETH
  
  `);
  } catch (e) {
    console.log(e);
    console.log("Something occured while wrapping or unwrapping ETH");
  }
};

const xdyeTokenTest = async () => {
  const web3 = new Web3("http://localhost:8545");
  const id = await web3.eth.net.getId();

  const gas = new web3.utils.BN("6000000");

  const addresses = await web3.eth.getAccounts();

  console.log(`
  
  ADD[0]: ${addresses[0]}
  ADD[2]: ${addresses[2]}
  
  
  `);

  const sushi = new web3.eth.Contract(Sushi.abi, Sushi.networks[id].address);
  const owner = await sushi.methods.owner().call();

  console.log(`
  
  Initial XdYe Owner:

  ${owner}

  `);

  try {
    console.log("Minting 1,000 XdYe from ADD[0] --> ADD[3]");

    const preMintAdd3 = await sushi.methods.balanceOf(addresses[3]).call();
    console.log(`
    
    ADD[3] Balance Pre Minting: ${web3.utils.fromWei(preMintAdd3)} XdYe
    `);

    await sushi.methods
      .mint(addresses[3], web3.utils.toWei("1000"))
      .send({ from: addresses[0], gas: gas });

    const postMintAdd3 = await sushi.methods.balanceOf(addresses[3]).call();
    console.log(`
    
      ADD[3] Balance Post Minting: ${web3.utils.fromWei(postMintAdd3)} XdYe
      `);

    await sushi.methods.transferOwnership(addresses[2]).send({
      from: addresses[0],
      gas: gas,
    });

    const owner2 = await sushi.methods.owner().call();

    console.log(`

  XdYe Ownership is now:
    ${owner2}
  `);

    console.log(`
    
    Now trying to change XdYe Ownership from ADD[0], Tx should revert

    `);

    try {
      await sushi.methods.transferOwnership(addresses[3]).send({
        from: addresses[0],
        gas: gas,
      });
      console.log("⛔️ ADD[0] can change the Ownership ");
    } catch (e) {
      console.log("✅ ADD[0] can not change the Ownership ");
    }
  } catch (e) {
    console.log(e);
    console.log("Something occured while transfering Ownership");
  }
};

const masterChefTesting = async () => {
  const web3 = new Web3("http://localhost:8545");

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const gas = new web3.utils.BN("6000000");

  const superBn = new web3.utils.BN(
    "10000000000000000000000000000000000000000"
  ); //? 10,000
  const bn = new web3.utils.BN("100000000000000000000000"); //? 10,000
  const bn2 = new web3.utils.BN("100000000000000000000"); //? 100

  //TODO: Smart Contracts Main Declaration

  const factory = new web3.eth.Contract(
    Factory.abi,
    Factory.networks[id].address
  );

  const router = new web3.eth.Contract(Router.abi, Router.networks[id].address);

  const tokenA = new web3.eth.Contract(tokenABI, TokenA.networks[id].address);
  const tokenB = new web3.eth.Contract(tokenABI, TokenB.networks[id].address);

  const sushi = new web3.eth.Contract(Sushi.abi, Sushi.networks[id].address);

  const masterChef = new web3.eth.Contract(
    MasterChef.abi,
    MasterChef.networks[id].address
  );

  const wewt = new web3.eth.Contract(WETH.abi, WETH.networks[id].address);

  let llp_tokenA_tokenB;

  try {
    const sushiBal = await sushi.methods.balanceOf(addresses[2]).call();

    const owner = await sushi.methods.owner().call();

    await sushi.methods.mint(addresses[2], superBn).send({
      from: owner,
      gas: gas,
    });

    await sushi.methods.mint(addresses[2], bn).send({
      from: owner,
      gas: gas,
    });

    await sushi.methods
      .transferOwnership(MasterChef.networks[id].address)
      .send({
        from: owner,
        gas: gas,
      });

    const sushiBal_ = await sushi.methods.balanceOf(addresses[2]).call();

    console.log(`
    
    Could mint XdYe to ADD[2]

    Pre_minting ADD[2]: ${web3.utils.fromWei(sushiBal)} XDYE
    Post_minting ADD[2]: ${web3.utils.fromWei(sushiBal_)} XDYE

    `);
  } catch (e) {
    console.log("ERROR: Miniting XDYEs");
    console.log(e);
  }

  try {
    //! Send TOKEN A and TOKEN B to ADD[2] to provide Liquidity

    const balTokenA2 = await tokenA.methods.balanceOf(addresses[0]).call();
    const balTokenB2 = await tokenB.methods.balanceOf(addresses[0]).call();
    const balTokenSushi = await sushi.methods.balanceOf(addresses[2]).call();

    console.log(balTokenA2);
    console.log(balTokenB2);
    console.log(balTokenSushi);

    await tokenA.methods.transfer(addresses[2], bn).send({
      from: addresses[0],
      gas: gas,
    });
    await tokenB.methods.transfer(addresses[2], bn).send({
      from: addresses[0],
      gas: gas,
    });

    await sushi.methods.transfer(addresses[3], bn).send({
      from: addresses[2],
      gas: gas,
    });

    console.log(`Trying to transfer:
    
    ADD[2]: ${web3.utils.fromWei(balTokenSushi)} XdYe to ADD[3]
    
    
    `);
  } catch (e) {
    console.log("ERROR: While sending Token A and Token B");
    console.log(e);
  }

  try {
    await tokenA.methods
      .approve(
        Router.networks[id].address,
        web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
      )
      .send({
        from: addresses[2],
        gas: gas,
      });
    await tokenB.methods
      .approve(
        Router.networks[id].address,
        web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
      )
      .send({
        from: addresses[2],
        gas: gas,
      });
    await sushi.methods
      .approve(
        Router.networks[id].address,
        web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
      )
      .send({
        from: addresses[2],
        gas: gas,
      });
    await sushi.methods
      .approve(
        MasterChef.networks[id].address,
        web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
      )
      .send({
        from: addresses[3],
        gas: gas,
      });

    console.log("XdYe, TOKEN A , TOKEN B have been approved");
  } catch (e) {
    console.log("ERROR: While fetching Total Supply Data");
    console.log(e);
  }

  try {
    await router.methods
      .addLiquidityETH(
        Sushi.networks[id].address,
        web3.utils.toWei("100"),
        0,
        0,
        addresses[2],
        Math.floor(Date.now() / 1000) + 60 * 10
      )
      .send({
        from: addresses[2],
        gas: gas,
        value: web3.utils.toWei("10"),
      });

    console.log("Could ADD Liquidity ");
  } catch (e) {
    console.log("ERROR: Creating MasterChef for pair ETH-XDYE");
    console.log(e);
  }

  setTimeout(async () => {
    try {
      const pairAddress = await factory.methods
        .getPair(WETH.networks[id].address, Sushi.networks[id].address)
        .call();

      await masterChef.methods.add(2, pairAddress, true).send({
        from: addresses[0],
        gas: gas,
      });

      console.log(`
    Created new FARM for ETH-XDYE (${pairAddress})  
    `);
      console.log(`
    MasterChef is now rewarding for ETH-XDYE LPs  
    `);
    } catch (e) {
      console.log("ERROR: Creating MasterChef for pair ETH-XDYE");
      console.log(e);
    }
  }, 10 * 1000);

  setTimeout(async () => {
    try {
      const pairAddress = await factory.methods
        .getPair(WETH.networks[id].address, Sushi.networks[id].address)
        .call();

      const pair = new web3.eth.Contract(Pair.abi, pairAddress);

      const lp_amount = await pair.methods.balanceOf(addresses[2]).call();

      console.log(`AD[2] has: ${web3.utils.fromWei(lp_amount)} LP to deposit`);

      await pair.methods.approve(MasterChef.networks[id].address, bn).send({
        from: addresses[2],
        gas: gas,
      });

      await masterChef.methods.deposit(0, lp_amount).send({
        from: addresses[2],
        gas: gas,
      });

      console.log("ADD[2] Could Deposit on Master Chef PoolId: 0 (ETH-XDYE)");
    } catch (e) {
      console.log("ERROR: Depositing to MasterChef for pair ETH-XDYE");
      console.log(e);
    }
  }, 15 * 1000);

  setTimeout(async () => {
    let pdtReward = await masterChef.methods
      .pendingSushi(0, addresses[2])
      .call();
    try {
      //? This is performed in order for Truffle to include another Tx (so we can check that rewards have been created)
      await web3.eth.sendTransaction({
        from: addresses[5],
        to: addresses[6],
        value: web3.utils.toWei("1"),
        gas: gas,
      });
      pdtReward = await masterChef.methods.pendingSushi(0, addresses[2]).call();
      console.log(` ADD[2] Pdt Reward: ${web3.utils.fromWei(pdtReward)} XDYE`);

      await web3.eth.sendTransaction({
        from: addresses[5],
        to: addresses[6],
        value: web3.utils.toWei("1"),
        gas: gas,
      });
      pdtReward = await masterChef.methods.pendingSushi(0, addresses[2]).call();
      console.log(` ADD[2] Pdt Reward: ${web3.utils.fromWei(pdtReward)} XDYE`);

      await web3.eth.sendTransaction({
        from: addresses[6],
        to: addresses[5],
        value: web3.utils.toWei("1"),
        gas: gas,
      });
      pdtReward = await masterChef.methods.pendingSushi(0, addresses[2]).call();
      console.log(` ADD[2] Pdt Reward: ${web3.utils.fromWei(pdtReward)} XDYE`);

      await web3.eth.sendTransaction({
        from: addresses[6],
        to: addresses[5],
        value: web3.utils.toWei("1"),
        gas: gas,
      });
      pdtReward = await masterChef.methods.pendingSushi(0, addresses[2]).call();
      console.log(` ADD[2] Pdt Reward: ${web3.utils.fromWei(pdtReward)} XDYE`);
    } catch (e) {
      console.log("ERROR: Making Tx or Fetching Pdt. Rewards");
      console.log(e);
    }
  }, 17 * 1000);

  setTimeout(async () => {
    let pdtReward = await masterChef.methods
      .pendingSushi(0, addresses[2])
      .call();
    console.log(`Pdt Reward: ${web3.utils.fromWei(pdtReward)}`);

    try {
      await web3.eth.sendTransaction({
        from: addresses[5],
        to: addresses[6],
        value: web3.utils.toWei("1"),
        gas: gas,
      });
      pdtReward = await masterChef.methods.pendingSushi(0, addresses[2]).call();
      console.log(` ADD[2] Pdt Reward: ${web3.utils.fromWei(pdtReward)} XDYE`);

      await web3.eth.sendTransaction({
        from: addresses[5],
        to: addresses[6],
        value: web3.utils.toWei("1"),
        gas: gas,
      });
      pdtReward = await masterChef.methods.pendingSushi(0, addresses[2]).call();
      console.log(` ADD[2] Pdt Reward: ${web3.utils.fromWei(pdtReward)} XDYE`);

      await web3.eth.sendTransaction({
        from: addresses[6],
        to: addresses[5],
        value: web3.utils.toWei("1"),
        gas: gas,
      });
      pdtReward = await masterChef.methods.pendingSushi(0, addresses[2]).call();
      console.log(` ADD[2] Pdt Reward: ${web3.utils.fromWei(pdtReward)} XDYE`);

      await web3.eth.sendTransaction({
        from: addresses[6],
        to: addresses[5],
        value: web3.utils.toWei("1"),
        gas: gas,
      });
      pdtReward = await masterChef.methods.pendingSushi(0, addresses[2]).call();
      console.log(` ADD[2] Pdt Reward: ${web3.utils.fromWei(pdtReward)} XDYE`);
    } catch (e) {
      console.log("ERROR: Making Tx or Fetching Pdt. Rewards");
      console.log(e);
    }
  }, 19 * 1000);

  setTimeout(async () => {
    try {
      const pairAddress = await factory.methods
        .getPair(WETH.networks[id].address, Sushi.networks[id].address)
        .call();
      const pair = new web3.eth.Contract(tokenABI, pairAddress);

      const beforeWith = await pair.methods.balanceOf(addresses[2]).call();
      const sushi_beforeWith = await sushi.methods
        .balanceOf(addresses[2])
        .call();

      console.log(`BEFORE WITHDRAWING from MC:
      
        USER ADD[2]: ${web3.utils.fromWei(beforeWith)} LP
        USER ADD[2]: ${web3.utils.fromWei(sushi_beforeWith)} XDYE
      
      `);

      await masterChef.methods.withdraw(0, userInfo.amount).send({
        from: addresses[2],
        gas: gas,
      });
      console.log("Could withdraw LP from Master Chef");

      const afterWith = await pair.methods.balanceOf(addresses[2]).call();
      const sushi_afterWith = await sushi.methods
        .balanceOf(addresses[2])
        .call();

      console.log(`AFTER WITHDRAWING from MC:
      
        USER ADD[2]: ${web3.utils.fromWei(afterWith)} LP
        USER ADD[2]: ${web3.utils.fromWei(sushi_afterWith)} XDYE
      
      `);
    } catch (e) {
      console.log("ERROR: Withdrawing LP from Master Chef");
      console.log(e);
    }
  }, 22 * 1000);
};

const barTesting = async () => {
  const web3 = new Web3("http://localhost:8545");

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const gas = new web3.utils.BN("6000000");

  const superBn = new web3.utils.BN(
    "10000000000000000000000000000000000000000"
  ); //? 10,000
  const bn = new web3.utils.BN("100000000000000000000000"); //? 10,000
  const bn2 = new web3.utils.BN("100000000000000000000"); //? 100

  //TODO: Smart Contracts Main Declaration

  const sushi = new web3.eth.Contract(Sushi.abi, Sushi.networks[id].address);
  const sushiBar = new web3.eth.Contract(
    SushiBar.abi,
    SushiBar.networks[id].address
  );

  //TODO: Smart Contracts Main Declaration

  try {
    const sushiBal = await sushi.methods.balanceOf(addresses[2]).call();

    const owner = await sushi.methods.owner().call();

    await sushi.methods.mint(addresses[2], bn).send({
      from: owner,
      gas: gas,
    });
    await sushi.methods.mint(addresses[2], bn).send({
      from: owner,
      gas: gas,
    });

    const sushiBal_ = await sushi.methods.balanceOf(addresses[2]).call();

    console.log(`
    
    Could mint XDYE to ADD[2]

    Pre_minting ADD[2]: ${web3.utils.fromWei(sushiBal)} XDYE
    Post_minting ADD[2]: ${web3.utils.fromWei(sushiBal_)} XDYE

    `);
  } catch (e) {
    console.log("ERROR: Miniting XDYEs");
    console.log(e);
  }

  try {
    await sushi.methods.transfer(addresses[3], bn).send({
      from: addresses[2],
      gas: gas,
    });

    console.log(`
    
    Transfered ${web3.utils.fromWei(bn)} from ADD[2] --> ADD[3]:

    `);
  } catch (e) {
    console.log("ERROR: While sending XDYE from ADD[2] --> ADD[3]");
    console.log(e);
  }

  setTimeout(async () => {
    try {
      await sushi.methods
        .approve(
          SushiBar.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[2],
          gas: gas,
        });
      await sushi.methods
        .approve(
          SushiBar.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[3],
          gas: gas,
        });

      console.log("XDYE approved for ADD[2] & ADD[3]");
    } catch (e) {
      console.log("ERROR: Couldn't approved XDYE for ADD[2] & ADD[3]");
      console.log(e);
    }
  });

  setTimeout(async () => {
    const bal2 = await sushi.methods.balanceOf(addresses[2]).call();

    console.log(`ADD[2] (pre-deposit): ${web3.utils.fromWei(bal2)} XDYE`);

    await sushiBar.methods.enter(bal2).send({
      from: addresses[2],
      gas: gas,
    });

    const bal = await sushi.methods.balanceOf(addresses[3]).call();

    console.log(`ADD[3] (pre-deposit): ${web3.utils.fromWei(bal)} XDYE`);

    await sushiBar.methods.enter(bal).send({
      from: addresses[3],
      gas: gas,
    });

    const postBal2 = await sushi.methods.balanceOf(addresses[3]).call();
    console.log(`ADD[2] (post-deposit): ${web3.utils.fromWei(postBal2)} XDYE`);

    const postBal = await sushi.methods.balanceOf(addresses[3]).call();
    console.log(`ADD[3] (post-deposit): ${web3.utils.fromWei(postBal)} XDYE`);
  }, 5 * 1000);

  setTimeout(async () => {
    try {
      const barBalance = await sushi.methods
        .balanceOf(SushiBar.networks[id].address)
        .call();

      const owner = await sushi.methods.owner().call();

      await sushi.methods.mint(SushiBar.networks[id].address, bn).send({
        from: owner,
        gas: gas,
      });

      const barBalance_ = await sushi.methods
        .balanceOf(SushiBar.networks[id].address)
        .call();

      console.log(`
      
      Sending XDYE to XdYe Bar Contract
  
      Pre_minting BAR: ${web3.utils.fromWei(barBalance)} XDYE
      Post_minting BAR: ${web3.utils.fromWei(barBalance_)} XDYE
  
      `);
    } catch (e) {
      console.log("ERROR: Miniting XDYEs");
      console.log(e);
    }
  }, 7 * 1000);

  //! MINTEAR XDYE y enviarlos a SUSHIBAR contract

  setTimeout(async () => {
    const bal = await sushiBar.methods.balanceOf(addresses[2]).call();
    console.log(`ADD[2] (pre-withdraw): ${web3.utils.fromWei(bal)} xXDYE`);
    const bal_ = await sushiBar.methods.balanceOf(addresses[3]).call();
    console.log(`ADD[3] (pre-withdraw): ${web3.utils.fromWei(bal_)} xXDYE`);
  }, 10 * 1000);

  setTimeout(async () => {
    console.log(`ADD[2] is leaving XdYe Bar`);
    const bal = await sushiBar.methods.balanceOf(addresses[2]).call();

    const withdrawAmount = await sushiBar.methods.leave(bal).send({
      from: addresses[2],
      gas: gas,
    });

    const bal_ = await sushiBar.methods.balanceOf(addresses[2]).call();
    const bal__ = await sushi.methods.balanceOf(addresses[2]).call();

    console.log(`
    
    ADD[2] has removed: ${web3.utils.fromWei(bal)} xXDYE

    ADD[2] xXDYE balance: ${web3.utils.fromWei(bal_)} xXDYE
    ADD[2] XDYE balance (pre-bar): ${web3.utils.fromWei(bn)} XDYE
    ADD[2] XDYE balance (post-bar): ${web3.utils.fromWei(bal__)} XDYE
    
    `);
  }, 12 * 1000);

  setTimeout(async () => {
    console.log(`ADD[3] is leaving XdYe Bar`);
    const bal = await sushiBar.methods.balanceOf(addresses[3]).call();

    const withdrawAmount = await sushiBar.methods.leave(bal).send({
      from: addresses[3],
      gas: gas,
    });

    const bal_ = await sushiBar.methods.balanceOf(addresses[3]).call();
    const bal__ = await sushi.methods.balanceOf(addresses[3]).call();

    console.log(`
    
    ADD[3] has removed: ${web3.utils.fromWei(bal)} xXDYE

    ADD[3] xXDYE balance: ${web3.utils.fromWei(bal_)} xXDYE
    ADD[3] XDYE balance (pre-bar): ${web3.utils.fromWei(bn)} XDYE
    ADD[3] XDYE balance (post-bar): ${web3.utils.fromWei(bal__)} XDYE
    
    `);
  }, 15 * 1000);
};

const checkXdYeMaker = async () => {
  const web3 = new Web3("http://localhost:8545");

  const id = await web3.eth.net.getId();

  const addresses = await web3.eth.getAccounts();

  const gas = new web3.utils.BN("6000000");

  const bn = new web3.utils.BN("100000000000000000000000"); //? 10,000
  const bn2 = new web3.utils.BN("10000000000000000000"); //? 100

  const factory = new web3.eth.Contract(
    Factory.abi,
    Factory.networks[id].address
  );

  const router = new web3.eth.Contract(Router.abi, Router.networks[id].address);

  const tokenA = new web3.eth.Contract(tokenABI, TokenA.networks[id].address);
  const tokenB = new web3.eth.Contract(tokenABI, TokenB.networks[id].address);

  const sushi = new web3.eth.Contract(Sushi.abi, Sushi.networks[id].address);
  const sushiBar = new web3.eth.Contract(
    SushiBar.abi,
    SushiBar.networks[id].address
  );
  const sushiMaker = new web3.eth.Contract(
    SushiMaker.abi,
    SushiMaker.networks[id].address
  );

  const wewt = new web3.eth.Contract(WETH.abi, WETH.networks[id].address);

  let llp_tokenA_tokenB;

  try {
    const sushiBal = await sushi.methods.balanceOf(addresses[2]).call();

    const owner = await sushi.methods.owner().call();

    await sushi.methods.mint(addresses[2], web3.utils.toWei("100000000")).send({
      from: owner,
      gas: gas,
    });

    const sushiBal_ = await sushi.methods.balanceOf(addresses[2]).call();

    console.log(`
    
    Could mint XDYE to ADD[2]

    Pre_minting ADD[2]: ${web3.utils.fromWei(sushiBal)} XDYE
    Post_minting ADD[2]: ${web3.utils.fromWei(sushiBal_)} XDYE

    `);
  } catch (e) {
    console.log("ERROR: Miniting XDYEs");
    console.log(e);
  }

  try {
    const sushiBal = await sushi.methods.balanceOf(addresses[3]).call();

    const owner = await sushi.methods.owner().call();

    await sushi.methods.mint(addresses[3], web3.utils.toWei("100000000")).send({
      from: owner,
      gas: gas,
    });

    const sushiBal_ = await sushi.methods.balanceOf(addresses[3]).call();

    console.log(`
    
    Could mint XDYE to ADD[3]

    Pre_minting ADD[3]: ${web3.utils.fromWei(sushiBal)} XDYE
    Post_minting ADD[3]: ${web3.utils.fromWei(sushiBal_)} XDYE

    `);
  } catch (e) {
    console.log("ERROR: Miniting XDYEs");
    console.log(e);
  }

  setTimeout(async () => {
    try {
      await sushi.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[2],
          gas: gas,
        });
      await sushi.methods
        .approve(
          SushiBar.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[3],
          gas: gas,
        });

      console.log("XDYE has been approved for Router & XdYe Bar");
    } catch (e) {
      console.log("ERROR: XDYE could NOT be approved for Router & XdYe Bar");
      console.log(e);
    }
  });

  setTimeout(async () => {
    try {
      await router.methods
        .addLiquidityETH(
          Sushi.networks[id].address,
          web3.utils.toWei("100"),
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({
          from: addresses[2],
          gas: gas,
          value: web3.utils.toWei("10"),
        });

      console.log(`
      
      Could create & add liquidity for pair (WETH - XDYE)
      
      `);
    } catch (e) {
      console.log(
        "ERROR: Could NOT create & add liquidity for pair (WETH - XDYE)"
      );
      console.log(e);
    }
  }, 10 * 1000);

  setTimeout(async () => {
    try {
      const amountOut_ETH_XDYE = await router.methods
        .getAmountsOut(web3.utils.toWei("25"), [
          WETH.networks[id].address,
          Sushi.networks[id].address,
        ])
        .call({ from: addresses[6] });
      console.log(
        "I am swaping: ",
        web3.utils.fromWei(amountOut_ETH_XDYE[0]),
        " ETH "
      );
      console.log(
        "I will get: ",
        web3.utils.fromWei(amountOut_ETH_XDYE[1]),
        " XDYE"
      );

      const amountOut_ETH_XDYE_min =
        web3.utils.fromWei(amountOut_ETH_XDYE[1]) * 0.8;

      console.log("Or a MINIMUM : ", amountOut_ETH_XDYE_min, " XDYE");

      const balanceXDYE_before = await sushi.methods
        .balanceOf(addresses[6])
        .call({ from: addresses[6] });
      console.log(`
        Purchaser ADD[6] XDYE Balance (before): ${web3.utils.fromWei(
          balanceXDYE_before
        )} XDYE
            `);

      const swap_amount = amountOut_ETH_XDYE_min.toString();

      const preETHBal = await web3.eth.getBalance(addresses[6]);
      console.log(`ETH BALANCE (before): ${web3.utils.fromWei(preETHBal)} ETH`);
      console.log("Preparing swap ETH --> XDYE");
      await router.methods
        .swapETHForExactTokens(
          web3.utils.toWei(swap_amount),
          [WETH.networks[id].address, Sushi.networks[id].address],
          addresses[6],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({
          from: addresses[6],
          gas: gas,
          value: web3.utils.toWei("25"),
        });
      console.log("Done SWAP (ETH-XDYE)");
      const balanceXDYE_after = await sushi.methods
        .balanceOf(addresses[6])
        .call({ from: addresses[6] });

      const postETHBal = await web3.eth.getBalance(addresses[6]);
      console.log(`ETH BALANCE (post): ${web3.utils.fromWei(postETHBal)} ETH`);
      console.log(`
            INFO: For 25 ETH
            Expecting AmountOutDesired: ${amountOut_ETH_XDYE_min}
    Purchaser ADD[6] XDYE Balance (after): ${web3.utils.fromWei(
      balanceXDYE_after
    )} XDYE
    `);
    } catch (e) {
      console.log("ERROR: When trying SWAP ETH --> XDYE");
      console.log(e);
    }
  }, 24 * 1000);

  //? 100000000.020657488079176532
  // setTimeout(async () => {
  //   try {
  //     const amountOut_ETH_XDYE = await router.methods
  //       .getAmountsOut(web3.utils.toWei("25"), [
  //         WETH.networks[id].address,
  //         Sushi.networks[id].address,
  //       ])
  //       .call({ from: addresses[6] });
  //     console.log(
  //       "I am swaping: ",
  //       web3.utils.fromWei(amountOut_ETH_XDYE[0]),
  //       " ETH "
  //     );
  //     console.log(
  //       "I will get: ",
  //       web3.utils.fromWei(amountOut_ETH_XDYE[1]),
  //       " XDYE"
  //     );

  //     const amountOut_ETH_XDYE_min =
  //       web3.utils.fromWei(amountOut_ETH_XDYE[1]) * 0.8;

  //     console.log("Or a MINIMUM : ", amountOut_ETH_XDYE_min, " XDYE");

  //     const balanceXDYE_before = await sushi.methods
  //       .balanceOf(addresses[6])
  //       .call({ from: addresses[6] });
  //     console.log(`
  //       Purchaser ADD[6] XDYE Balance (before): ${web3.utils.fromWei(
  //         balanceXDYE_before
  //       )} XDYE
  //           `);

  //     const swap_amount = amountOut_ETH_XDYE_min.toString();

  //     const preETHBal = await web3.eth.getBalance(addresses[6]);
  //     console.log(`ETH BALANCE (before): ${web3.utils.fromWei(preETHBal)} ETH`);
  //     console.log("Preparing swap ETH --> XDYE");
  //     await router.methods
  //       .swapETHForExactTokens(
  //         web3.utils.toWei(swap_amount),
  //         [WETH.networks[id].address, Sushi.networks[id].address],
  //         addresses[6],
  //         Math.floor(Date.now() / 1000) + 60 * 10
  //       )
  //       .send({
  //         from: addresses[6],
  //         gas: gas,
  //         value: web3.utils.toWei("25"),
  //       });
  //     console.log("Done SWAP (ETH-XDYE)");
  //     const balanceXDYE_after = await sushi.methods
  //       .balanceOf(addresses[6])
  //       .call({ from: addresses[6] });

  //     const postETHBal = await web3.eth.getBalance(addresses[6]);
  //     console.log(`ETH BALANCE (post): ${web3.utils.fromWei(postETHBal)} ETH`);
  //     console.log(`
  //           INFO: For 25 ETH
  //           Expecting AmountOutDesired: ${amountOut_ETH_XDYE_min}
  //   Purchaser ADD[3] XDYE Balance (after): ${web3.utils.fromWei(
  //     balanceXDYE_after
  //   )} XDYE
  //   `);

  //     let lp_add_ = await factory.methods
  //       .getPair(WETH.networks[id].address, Sushi.networks[id].address)
  //       .call();

  //     const swapPair_ = new web3.eth.Contract(Pair.abi, lp_add_);

  //     const some = await swapPair_.methods.getReserves().call();
  //     const lastK = await swapPair_.methods.kLast().call();

  //     const rootk = Math.sqrt(some[0] * some[1]);
  //     const rootklast = Math.sqrt(lastK);

  //     console.log(`
  //   Pair ETH - XDYE:

  //   Reserve0 = ${web3.utils.fromWei(some[0])}
  //   Reserve1 = ${web3.utils.fromWei(some[1])}

  //   rootK     =  ${rootk}
  //   rootKLast =  ${rootklast}
  //   `);

  //     let lp_add = await factory.methods
  //       .getPair(WETH.networks[id].address, Sushi.networks[id].address)
  //       .call();

  //     const swapPair = new web3.eth.Contract(Pair.abi, lp_add);

  //     const kLast = await swapPair.methods.kLast().call();

  //     console.log(`
  //     After SWAP, Pair ETH-XDYE kLast --> ${kLast}
  //   `);
  //   } catch (e) {
  //     console.log("ERROR: When trying SWAP ETH --> XDYE");
  //     console.log(e);
  //   }
  // }, 25 * 1000);

  setTimeout(async () => {
    const xdyeInWallet = await sushi.methods.balanceOf(addresses[3]).call();

    await sushi.methods
      .approve(SushiBar.networks[id].address, xdyeInWallet)
      .send({ from: addresses[3], gas: gas });

    await sushiBar.methods
      .enter(xdyeInWallet)
      .send({ from: addresses[3], gas: gas });

    const postXdyeInWallet = await sushi.methods.balanceOf(addresses[3]).call();

    console.log(`
    
    -- Interacting with XdYe BAR --
    
    ADD[3] (Balance PreDeposit on BAR): ${web3.utils.fromWei(xdyeInWallet)} XDYE

    ADD[3] (Balance PostDeposit on BAR): ${web3.utils.fromWei(
      postXdyeInWallet
    )} XDYE

    `);
  }, 26 * 1000);

  setTimeout(async () => {
    //! Remove Liquidity (because TradingFees are minted when user ADDs/Withdraws Liquidity)

    try {
      const llp_WETH_XDYE = await factory.methods
        .getPair(WETH.networks[id].address, Sushi.networks[id].address)
        .call();

      console.log(`Removing Liquidity of: ${llp_WETH_XDYE}`);

      const token_llp = new web3.eth.Contract(
        UniswapV2ERC20.abi,
        llp_WETH_XDYE
      );

      const user_balance_token_llp = await token_llp.methods
        .balanceOf(addresses[2])
        .call();

      const pair_eth_xdye = new web3.eth.Contract(Pair.abi, llp_WETH_XDYE);

      const _balance = await token_llp.methods.balanceOf(addresses[2]).call();

      let withAmount = web3.utils.fromWei(_balance) * 0.5;

      const bnRemove = "100";

      await pair_eth_xdye.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[2],
          gas: gas,
        });

      console.log('Approved ETH-XDYE LP "manipulation"');

      //? EXTRA
      const liquidity = await pair_eth_xdye.methods
        .balanceOf(llp_WETH_XDYE)
        .call();

      console.log(liquidity);
      console.log(web3.utils.fromWei(liquidity));
      //?
      amount = web3.utils.toWei(withAmount.toString(), "ether");

      await router.methods
        .removeLiquidityETH(
          Sushi.networks[id].address,
          amount,
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas });

      console.log("Could Remove (50%) Liquidity ETH-XDYE");

      const endBal = await token_llp.methods.balanceOf(addresses[2]).call();
      console.log(`User has: ${web3.utils.fromWei(endBal)} ETH-XDYE LP`);
    } catch (e) {
      console.log("ERROR: Removing Liquidity");
      console.log(e);
    }
  }, 37 * 1000);

  setTimeout(async () => {
    try {
      await sushiMaker.methods
        .convert(WETH.networks[id].address, Sushi.networks[id].address)
        .send({
          from: addresses[4],
          gas: gas,
        });
      console.log("Could Execute: Sushi Maker convert() from a ANY ADD ");
    } catch (e) {
      console.log("FAILED ON XDYE MAKER CONVERT from ADD[4]");
      console.log(e);
    }
  }, 44 * 1000);

  //! Sushi Bar (User approach) deposit SUSHI --> get xSUSHI, then xSUSHI to SUSHI (increase SUSHI amount?)

  //! Check if SYST. ARQUITECTURE worked

  setTimeout(async () => {
    try {
      const add3_xdye_in_bar = await sushiBar.methods
        .balanceOf(addresses[3])
        .call();

      console.log(web3.utils.fromWei(add3_xdye_in_bar));
      console.log(web3.utils.fromWei(add3_xdye_in_bar));
      console.log(web3.utils.fromWei(add3_xdye_in_bar));

      await sushiBar.methods
        .leave(add3_xdye_in_bar)
        .send({ from: addresses[3], gas: gas });

      console.log("✅ Could leave XdYe Bar");

      const sushiPostBar = await sushi.methods.balanceOf(addresses[3]).call();

      console.log(`
      
      _ Post XdYe Bar Summary _

      ADD[3]:  ${web3.utils.fromWei(sushiPostBar)} XDYE        
      
      `);
    } catch (e) {
      console.log("ERROR: While checking FINAL DATA");
      console.log(e);
    }
  }, 50 * 1000);

  setTimeout(async () => {
    try {
      const addressPair_1 = await factory.methods
        .getPair(WETH.networks[id].address, Sushi.networks[id].address)
        .call();

      const eth_xdye_lp_contract = new web3.eth.Contract(
        tokenABI,
        addressPair_1
      );

      const balFee = await wewt.methods.balanceOf(addresses[7]).call();
      const balFee_ = await web3.eth.getBalance(addresses[7]);
      const balFee__ = await sushi.methods.balanceOf(addresses[7]).call();

      const __balFee = await eth_xdye_lp_contract.methods
        .balanceOf(addresses[7])
        .call();

      console.log(`
      
      _ MY FEES Summary _ (checker)

      ADD[7]: ${web3.utils.fromWei(__balFee)} LP (ETH-XDYE)
      ADD[7]: ${web3.utils.fromWei(balFee__)} XDYE        
      ADD[7]: ${web3.utils.fromWei(balFee)} WETH      
      
      `);

      const lmnFee = await wewt.methods.balanceOf(addresses[8]).call();
      const lmnFee_ = await web3.eth.getBalance(addresses[8]);
      const lmnFee__ = await sushi.methods.balanceOf(addresses[8]).call();

      const __lmnFee = await eth_xdye_lp_contract.methods
        .balanceOf(addresses[8])
        .call();

      console.log(`
      
      _ XDYE FEES Summary _

      Lemon Fee[8]: ${web3.utils.fromWei(__lmnFee)} LP (ETH-XDYE)
      Lemon Fee[8]: ${web3.utils.fromWei(lmnFee__)} XDYE        
      Lemon Fee[8]: ${web3.utils.fromWei(lmnFee)} WETH        
      
      `);

      const sushiMaker_sushi = await sushi.methods
        .balanceOf(SushiMaker.networks[id].address)
        .call();
      const sushiMaker_ewt = await web3.eth.getBalance(
        SushiMaker.networks[id].address
      );
      const sushiMaker_wewt = await wewt.methods
        .balanceOf(SushiMaker.networks[id].address)
        .call();

      const sushiMaker_ewt_sushi_lp = await eth_xdye_lp_contract.methods
        .balanceOf(SushiMaker.networks[id].address)
        .call();

      console.log(`
      
      _ Sushi Maker Summary _

      SushiMaker ADD: ${web3.utils.fromWei(
        sushiMaker_ewt_sushi_lp
      )} LP (ETH-XDYE)
      SushiMaker ADD: ${web3.utils.fromWei(sushiMaker_sushi)} XDYE        
      SushiMaker ADD: ${web3.utils.fromWei(sushiMaker_wewt)} WETH 
      
      `);

      const sushiBar_sushi = await sushi.methods
        .balanceOf(SushiBar.networks[id].address)
        .call();
      const sushiBar_ewt = await web3.eth.getBalance(
        SushiBar.networks[id].address
      );
      const sushiBar_wewt = await wewt.methods
        .balanceOf(SushiBar.networks[id].address)
        .call();

      console.log(`
      
      _ Sushi Bar Summary _

      SushiMaker ADD: ${web3.utils.fromWei(sushiBar_sushi)} XDYE        
      SushiMaker ADD: ${web3.utils.fromWei(sushiBar_wewt)} WETH 
      
      `);
    } catch (e) {
      console.log("ERROR: While checking FINAL DATA");
      console.log(e);
    }
  }, 55 * 1000);
};

const checkUnlocker = async () => {
  const web3 = new Web3("http://localhost:8545");

  const id = await web3.eth.net.getId();

  const addresses = await web3.eth.getAccounts();

  const gas = new web3.utils.BN("6000000");

  const bn = new web3.utils.BN("100000000000000000000000"); //? 10,000
  const bn2 = new web3.utils.BN("10000000000000000000"); //? 100

  const unlock = new web3.eth.Contract(Unlock.abi, Unlock.networks[id].address);

  try {
    const result = await unlock.methods.unlockList(addresses[2]).call();
    console.log(`
    Before paying Fee, XdYe Unlock Contract response:
    ${result}
    `);
    await unlock.methods.unlock().send({
      from: addresses[2],
      value: web3.utils.toWei("0.5"),
      gas: gas,
    });
    console.log(`
    ADD[2] has paied 0.5 ETH
    `);
    const result2 = await unlock.methods.unlockList(addresses[2]).call();
    console.log(`
    After paying Fee, XdYe Unlock Contract response:
    ${result2}
    `);

    const ethBal = await web3.eth.getBalance(addresses[9]);

    console.log(`
    
    ADD[9] is the receiver of Unlock Fees: 
    ETH Balance: ${web3.utils.fromWei(ethBal) - 100}
    
    `);
  } catch (e) {
    console.log(e);
  }

  const router = new web3.eth.Contract(Router.abi, Router.networks[id].address);
};

const checkEverythingIsWorkingOnXdYe = async () => {
  const web3 = new Web3("http://localhost:8545");

  const id = await web3.eth.net.getId();

  const addresses = await web3.eth.getAccounts();

  const gas = new web3.utils.BN("6000000");

  const bn = new web3.utils.BN("100000000000000000000000"); //? 10,000
  const bn2 = new web3.utils.BN("10000000000000000000"); //? 100

  const factory = new web3.eth.Contract(
    Factory.abi,
    Factory.networks[id].address
  );

  const router = new web3.eth.Contract(Router.abi, Router.networks[id].address);

  const tokenA = new web3.eth.Contract(tokenABI, TokenA.networks[id].address);
  const tokenB = new web3.eth.Contract(tokenABI, TokenB.networks[id].address);

  const xdye = new web3.eth.Contract(Sushi.abi, Sushi.networks[id].address);
  const xdyeBar = new web3.eth.Contract(
    SushiBar.abi,
    SushiBar.networks[id].address
  );
  const xdyeMaker = new web3.eth.Contract(
    SushiMaker.abi,
    SushiMaker.networks[id].address
  );

  const weth = new web3.eth.Contract(WETH.abi, WETH.networks[id].address);

  let llp_tokenA_tokenB;

  //TODO: Smart Contracts Main Declaration

  try {
    const xdyeBal = await xdye.methods.balanceOf(addresses[2]).call();

    const owner = await xdye.methods.owner().call();

    await xdye.methods.mint(addresses[2], web3.utils.toWei("100000000")).send({
      from: owner,
      gas: gas,
    });

    const xdyeBal_ = await xdye.methods.balanceOf(addresses[2]).call();

    console.log(`
    
    Could mint XDYE to ADD[2]

    Pre_minting ADD[2]: ${web3.utils.fromWei(xdyeBal)} XDYE
    Post_minting ADD[2]: ${web3.utils.fromWei(xdyeBal_)} XDYE

    `);
  } catch (e) {
    console.log("ERROR: Miniting XDYEs");
    console.log(e);
  }

  //! This has been done on the deployment procedure
  // try {
  //   await factory.methods.setFeeTo(SushiMaker.networks[id].address).send({
  //     from: addresses[0],
  //     gas: gas,
  //   });

  //   console.log("Could change FEE To XdYe Maker");
  // } catch (e) {
  //   console.log("⛔️ ERROR: While CHANGING FACTORY FEE --> XdYe Maker");
  //   console.log(e);
  // }

  try {
    //! Send TOKEN A and TOKEN B to ADD[2] to provide Liquidity

    const balTokenA2 = await tokenA.methods.balanceOf(addresses[0]).call();
    const balTokenB2 = await tokenB.methods.balanceOf(addresses[0]).call();
    const balTokenXdYe = await xdye.methods.balanceOf(addresses[2]).call();

    console.log(balTokenA2);
    console.log(balTokenB2);
    console.log(balTokenXdYe);

    await tokenA.methods.transfer(addresses[2], bn).send({
      from: addresses[0],
      gas: gas,
    });
    await tokenB.methods.transfer(addresses[2], bn).send({
      from: addresses[0],
      gas: gas,
    });
    // await xdye.methods.transfer(addresses[3], balTokenXdYe).send({
    //   from: addresses[2],
    //   gas: gas,
    // });

    // console.log(`Trying to transfer:

    // ADD[2]: ${web3.utils.fromWei(balTokenXdYe)} XdYe to ADD[3]

    // `);

    const balIn2 = await xdye.methods.balanceOf(addresses[2]).call();

    await xdye.methods.transfer(addresses[3], bn2).send({
      from: addresses[2],
      gas: gas,
    });

    const preAddLiquidityTokenA = await tokenA.methods
      .balanceOf(addresses[2])
      .call();
    const preAddLiquidityTokenB = await tokenB.methods
      .balanceOf(addresses[2])
      .call();

    console.log(`
ADD[2]: ${web3.utils.fromWei(preAddLiquidityTokenA)} TKA
ADD[2]: ${web3.utils.fromWei(preAddLiquidityTokenB)} TKB

`);
  } catch (e) {
    console.log("ERROR: While sending Token A and Token B");
    console.log(e);
  }

  setTimeout(async () => {
    try {
      const tsTokenA = await tokenA.methods.totalSupply().call();
      const tsTokenB = await tokenA.methods.totalSupply().call();
      const tsWeth = await weth.methods.totalSupply().call();
      const tsXdYe = await xdye.methods.totalSupply().call();

      console.log(`TS A: ${web3.utils.fromWei(tsTokenA)}`);
      console.log(`TS B: ${web3.utils.fromWei(tsTokenB)}`);
      console.log(`TS WETH: ${web3.utils.fromWei(tsWeth)}`);
      console.log(`TS XDYE: ${web3.utils.fromWei(tsXdYe)}`);

      await tokenA.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[2],
          gas: gas,
        });
      await tokenB.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[2],
          gas: gas,
        });
      await xdye.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[2],
          gas: gas,
        });

      console.log("XDYE, TOKEN A , TOKEN B have been approved");
    } catch (e) {
      console.log("ERROR: While Approving Tokens (line: 5393)");
      console.log(e);
    }
  });

  setTimeout(async () => {
    try {
      //? Try to create Pair through Factory

      await router.methods
        .addLiquidityETH(
          TokenA.networks[id].address,
          web3.utils.toWei("10000"),
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas, value: web3.utils.toWei("10") });
      console.log("Added liquidity to WETH - TKA ");

      let lp_add_ = await factory.methods
        .getPair(WETH.networks[id].address, TokenA.networks[id].address)
        .call();

      const swapPair_ = new web3.eth.Contract(Pair.abi, lp_add_);

      const some = await swapPair_.methods.getReserves().call();
      const lastK = await swapPair_.methods.kLast().call();

      const rootk = Math.sqrt(some[0] * some[1]);
      const rootklast = Math.sqrt(lastK);

      console.log(`
      Pair ETH - A:

      Reserve0 = ${web3.utils.fromWei(some[0])}
      Reserve1 = ${web3.utils.fromWei(some[1])}

      rootK     =  ${rootk}
      rootKLast =  ${rootklast}
      `);

      await router.methods
        .addLiquidityETH(
          Sushi.networks[id].address,
          web3.utils.toWei("100"),
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({
          from: addresses[2],
          gas: gas,
          value: web3.utils.toWei("10"),
        });

      console.log(`
      
      Could create & add liquidity for pair (WETH - XDYE)
      
      `);

      await router.methods
        .addLiquidityETH(
          TokenB.networks[id].address,
          web3.utils.toWei("10000"),
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas, value: web3.utils.toWei("30") });
      console.log("Added liquidity to WETH - TKB ");

      await router.methods
        .addLiquidity(
          TokenA.networks[id].address,
          TokenB.networks[id].address,
          web3.utils.toWei("1000"),
          web3.utils.toWei("1000"),
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas });
      console.log("Added liquidity to TKA - TKB ");

      const postAddLiquidityTokenA = await tokenA.methods
        .balanceOf(addresses[2])
        .call();
      const postAddLiquidityTokenB = await tokenB.methods
        .balanceOf(addresses[2])
        .call();

      console.log(`
ADD[2]: ${web3.utils.fromWei(postAddLiquidityTokenA)} TKA
ADD[2]: ${web3.utils.fromWei(postAddLiquidityTokenB)} TKB

`);

      const llp_WETH_A = await factory.methods
        .getPair(WETH.networks[id].address, TokenA.networks[id].address)
        .call();

      const pair = new web3.eth.Contract(Pair.abi, llp_WETH_A);

      const add2balanceLP = await pair.methods.balanceOf(addresses[2]).call();
      console.log("ADDRESS_2 (WETH-TKA LP) WEI format", add2balanceLP);
      console.log(
        "ADDRESS_2 (WETH-TKA LP) No WEI format",
        web3.utils.fromWei(add2balanceLP)
      );

      // console.log(dataReturnedAddLiquidity)
    } catch (e) {
      console.log("ERROR: While Adding Liquidity to PAIR (A-B)");
      console.log(e);
    }
  }, 10 * 1000);

  setTimeout(async () => {
    //? Get Reserve INFORMATION
    try {
      lp_weth_tka = await factory.methods
        .getPair(WETH.networks[id].address, TokenA.networks[id].address)
        .call();
      console.log(`ETH - Token A LP address: ${lp_weth_tka}`);
      const pair = new web3.eth.Contract(Pair.abi, lp_weth_tka);
      const token0 = await pair.methods.token0().call();
      const token1 = await pair.methods.token1().call();

      console.log(`
      Token 0: ${token0}
      Token 1: ${token1}
      `);

      const reserve = await pair.methods.getReserves().call();

      console.log(`
      Reserve Token 0: ${web3.utils.fromWei(reserve._reserve0)}
      Reserve Token 1: ${web3.utils.fromWei(reserve._reserve1)}
      `);

      lp_weth_tkb = await factory.methods
        .getPair(WETH.networks[id].address, TokenB.networks[id].address)
        .call();
      console.log(`ETH - Token B LP address: ${lp_weth_tkb}`);
      const _pair = new web3.eth.Contract(Pair.abi, lp_weth_tkb);
      const _token0 = await _pair.methods.token0().call();
      const _token1 = await _pair.methods.token1().call();

      console.log(`
      Token 0: ${_token0}
      Token 1: ${_token1}
      `);

      const _reserve = await _pair.methods.getReserves().call();

      console.log(`
      Reserve Token 0: ${web3.utils.fromWei(_reserve._reserve0)}
      Reserve Token 1: ${web3.utils.fromWei(_reserve._reserve1)}
      `);

      lp_tka_tkb = await factory.methods
        .getPair(TokenA.networks[id].address, TokenB.networks[id].address)
        .call();
      console.log(`Token A - Token B LP address: ${lp_tka_tkb}`);
      const __pair = new web3.eth.Contract(Pair.abi, lp_tka_tkb);
      const __token0 = await __pair.methods.token0().call();
      const __token1 = await __pair.methods.token1().call();

      console.log(`
      Token A: ${__token0}
      Token B: ${__token1}
      `);

      const __reserve = await __pair.methods.getReserves().call();

      console.log(`
      Reserve Token 0: ${web3.utils.fromWei(__reserve._reserve0)}
      Reserve Token 1: ${web3.utils.fromWei(__reserve._reserve1)}
      `);
    } catch (e) {
      console.log("ERROR: While Getting Pair Data");
      console.log(e);
    }
  }, 20 * 1000);

  //* SWAP ETH --> TKA (1)
  setTimeout(async () => {
    try {
      const amountOut_ETH_TKA = await router.methods
        .getAmountsOut(web3.utils.toWei("10"), [
          WETH.networks[id].address,
          TokenA.networks[id].address,
        ])
        .call({ from: addresses[3] });
      console.log(
        "I am swaping: ",
        web3.utils.fromWei(amountOut_ETH_TKA[0]),
        "wETH"
      );
      console.log("I will get: ", web3.utils.fromWei(amountOut_ETH_TKA[1]));

      const amountOut_ETH_TKA_min = web3.utils.fromWei(amountOut_ETH_TKA[1]);

      console.log("Or a MINIMUM : ", amountOut_ETH_TKA_min, "TKA");

      const balanceTKA_before = await tokenA.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });
      console.log(`
        Purchaser ADD[3] TKA Balance (before): ${web3.utils.fromWei(
          balanceTKA_before
        )} TKA
            `);

      const swap_amount = amountOut_ETH_TKA_min.toString();

      const preETHBal = await web3.eth.getBalance(addresses[3]);
      console.log(`ETH BALANCE (before): ${web3.utils.fromWei(preETHBal)} ETH`);
      console.log("Preparing swap ETH --> TKA");
      await router.methods
        .swapETHForExactTokens(
          web3.utils.toWei(swap_amount),
          [WETH.networks[id].address, TokenA.networks[id].address],
          addresses[3],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({
          from: addresses[3],
          gas: gas,
          value: web3.utils.toWei("10"),
        });
      console.log("Done SWAP (ETH-TKA)");
      const balanceTKA_after = await tokenA.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });

      const postETHBal = await web3.eth.getBalance(addresses[3]);
      console.log(`ETH BALANCE (post): ${web3.utils.fromWei(postETHBal)} ETH`);
      console.log(`
            INFO: For 10 EWT
            Expecting AmountOutDesired: ${amountOut_ETH_TKA_min}
    Purchaser ADD[3] TKA Balance (after): ${web3.utils.fromWei(
      balanceTKA_after
    )} TKA
    `);

      let lp_add_ = await factory.methods
        .getPair(WETH.networks[id].address, TokenA.networks[id].address)
        .call();

      const swapPair_ = new web3.eth.Contract(Pair.abi, lp_add_);

      const some = await swapPair_.methods.getReserves().call();
      const lastK = await swapPair_.methods.kLast().call();

      const rootk = Math.sqrt(some[0] * some[1]);
      const rootklast = Math.sqrt(lastK);

      console.log(`
    Pair ETH - A:

    Reserve0 = ${web3.utils.fromWei(some[0])}
    Reserve1 = ${web3.utils.fromWei(some[1])}

    rootK     =  ${rootk}
    rootKLast =  ${rootklast}
    `);

      let lp_add = await factory.methods
        .getPair(WETH.networks[id].address, TokenA.networks[id].address)
        .call();

      const swapPair = new web3.eth.Contract(Pair.abi, lp_add);

      const kLast = await swapPair.methods.kLast().call();

      console.log(`
      After SWAP, Pair ETH-TKA kLast --> ${kLast}
    `);
    } catch (e) {
      console.log("ERROR: When trying SWAP ETH --> TKA");
      console.log(e);
    }
  }, 21 * 1000);

  setTimeout(async () => {
    try {
      const amountOut_ETH_TKA = await router.methods
        .getAmountsOut(web3.utils.toWei("25"), [
          WETH.networks[id].address,
          Sushi.networks[id].address,
        ])
        .call({ from: addresses[6] });
      console.log(
        "I am swaping: ",
        web3.utils.fromWei(amountOut_ETH_TKA[0]),
        "wETH"
      );
      console.log(
        "I will get: ",
        web3.utils.fromWei(amountOut_ETH_TKA[1]),
        " XDYE"
      );

      const amountOut_ETH_TKA_min =
        web3.utils.fromWei(amountOut_ETH_TKA[1]) * 0.8;

      console.log("Or a MINIMUM : ", amountOut_ETH_TKA_min, "XDYE");

      const balanceTKA_before = await xdye.methods
        .balanceOf(addresses[6])
        .call({ from: addresses[6] });
      console.log(`
        Purchaser ADD[3] TKA Balance (before): ${web3.utils.fromWei(
          balanceTKA_before
        )} XDYE
            `);

      const swap_amount = amountOut_ETH_TKA_min.toString();

      const preETHBal = await web3.eth.getBalance(addresses[6]);
      console.log(`ETH BALANCE (before): ${web3.utils.fromWei(preETHBal)} ETH`);
      console.log("Preparing swap ETH --> XDYE");
      await router.methods
        .swapETHForExactTokens(
          web3.utils.toWei(swap_amount),
          [WETH.networks[id].address, Sushi.networks[id].address],
          addresses[6],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({
          from: addresses[6],
          gas: gas,
          value: web3.utils.toWei("25"),
        });
      console.log("Done SWAP (ETH-XDYE)");
      const balanceXDYE_after = await tokenA.methods
        .balanceOf(addresses[6])
        .call({ from: addresses[6] });

      const postETHBal = await web3.eth.getBalance(addresses[6]);
      console.log(`ETH BALANCE (post): ${web3.utils.fromWei(postETHBal)} ETH`);
      console.log(`
            INFO: For 25 ETH
            Expecting AmountOutDesired: ${amountOut_ETH_TKA_min}
    Purchaser ADD[3] XDYE Balance (after): ${web3.utils.fromWei(
      balanceXDYE_after
    )} TKA
    `);

      let lp_add_ = await factory.methods
        .getPair(WETH.networks[id].address, Sushi.networks[id].address)
        .call();

      const swapPair_ = new web3.eth.Contract(Pair.abi, lp_add_);

      const some = await swapPair_.methods.getReserves().call();
      const lastK = await swapPair_.methods.kLast().call();

      const rootk = Math.sqrt(some[0] * some[1]);
      const rootklast = Math.sqrt(lastK);

      console.log(`
    Pair ETH - XDYE:

    Reserve0 = ${web3.utils.fromWei(some[0])}
    Reserve1 = ${web3.utils.fromWei(some[1])}

    rootK     =  ${rootk}
    rootKLast =  ${rootklast}
    `);

      let lp_add = await factory.methods
        .getPair(WETH.networks[id].address, Sushi.networks[id].address)
        .call();

      const swapPair = new web3.eth.Contract(Pair.abi, lp_add);

      const kLast = await swapPair.methods.kLast().call();

      console.log(`
      After SWAP, Pair ETH-XDYE kLast --> ${kLast}
    `);
    } catch (e) {
      console.log("ERROR: When trying SWAP ETH --> XDYE");
      console.log(e);
    }
  }, 24 * 1000);

  setTimeout(async () => {
    const xdyeInWallet = await xdye.methods.balanceOf(addresses[3]).call();

    await xdye.methods
      .approve(SushiBar.networks[id].address, xdyeInWallet)
      .send({ from: addresses[3], gas: gas });

    await xdyeBar.methods
      .enter(xdyeInWallet)
      .send({ from: addresses[3], gas: gas });

    const postXdYeInWallet = await xdye.methods.balanceOf(addresses[3]).call();

    console.log(`
    
    -- Interacting with XDYE BAR --
    
    ADD[3] (XDYE Balance PreDeposit on BAR): ${web3.utils.fromWei(
      xdyeInWallet
    )} XDYE

    ADD[3] (XDYE Balance PostDeposit on BAR): ${web3.utils.fromWei(
      postXdYeInWallet
    )} XDYE

    `);
  }, 26 * 1000);

  //* SWAP TKA --> TKB (2)
  setTimeout(async () => {
    try {
      const tka_balance_init = await tokenA.methods
        .balanceOf(addresses[3])
        .call();

      const tkb_balance_init = await tokenB.methods
        .balanceOf(addresses[3])
        .call();

      const amountOut_TKA_TKB = await router.methods
        .getAmountsOut(tka_balance_init, [
          TokenA.networks[id].address,
          TokenB.networks[id].address,
        ])
        .call({ from: addresses[3] });

      const amountOut_TKA_TKB_min =
        web3.utils.fromWei(amountOut_TKA_TKB[1]) * 0.8;

      await tokenA.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[3],
          gas: gas,
        });

      await router.methods
        .swapTokensForExactTokens(
          amountOut_TKA_TKB[1],
          tka_balance_init,
          [TokenA.networks[id].address, TokenB.networks[id].address],
          addresses[3],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({
          from: addresses[3],
          gas: gas,
        });

      console.log("SWAP_1");

      const balanceTKB_after = await tokenB.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });
      const balanceTKA_after = await tokenA.methods
        .balanceOf(addresses[3])
        .call({ from: addresses[3] });

      console.log(`
        
        SUMMARY: Trading TKA --> TKB

          TKA Balance (pre): ${web3.utils.fromWei(tka_balance_init)} TKA
          TKB Balance (pre): ${web3.utils.fromWei(tkb_balance_init)} TKB

          After Trading
          -------------

          TKA Balance (post): ${web3.utils.fromWei(balanceTKA_after)} TKA
          TKB Balance (post): ${web3.utils.fromWei(balanceTKB_after)} TKB
          
        
        
        
        `);

      let lp_add_ = await factory.methods
        .getPair(WETH.networks[id].address, TokenA.networks[id].address)
        .call();

      const swapPair_ = new web3.eth.Contract(Pair.abi, lp_add_);

      const some = await swapPair_.methods.getReserves().call();
      const lastK = await swapPair_.methods.kLast().call();

      const rootk = Math.sqrt(some[0] * some[1]);
      const rootklast = Math.sqrt(lastK);

      console.log(`
    Pair ETH - A:

    Reserve0 = ${web3.utils.fromWei(some[0])}
    Reserve1 = ${web3.utils.fromWei(some[1])}

    rootK     =  ${rootk}
    rootKLast =  ${rootklast}
    `);

      let lp_add = await factory.methods
        .getPair(WETH.networks[id].address, TokenA.networks[id].address)
        .call();

      const swapPair = new web3.eth.Contract(Pair.abi, lp_add);

      const kLast = await swapPair.methods.kLast().call();

      console.log(`
      After SWAP, Pair ETH-TKA kLast --> ${kLast}
    `);
    } catch (e) {
      console.log("ERROR: When trying SWAP ETH --> TKA");
      console.log(e);
    }
  }, 26 * 1000);

  setTimeout(async () => {
    //! Remove Liquidity (because TradingFees are minted when user ADDs/Withdraws Liquidity)

    try {
      const llp_WETH_A = await factory.methods
        .getPair(WETH.networks[id].address, TokenA.networks[id].address)
        .call();

      console.log(`Removing Liquidity of: ${llp_WETH_A}`);

      const token_llp = new web3.eth.Contract(UniswapV2ERC20.abi, llp_WETH_A);

      const user_balance_token_llp = await token_llp.methods
        .balanceOf(addresses[2])
        .call();

      const pair_eth_a = new web3.eth.Contract(Pair.abi, llp_WETH_A);

      const pairData = await pair_eth_a.methods.getReserves().call();
      console.log(`
    Pair Data:
      - Token0 (${web3.utils.fromWei(pairData._reserve0)})  
      - Token1 (${web3.utils.fromWei(pairData._reserve1)})

    `);

      let ewt_reserve;
      let tka_reserve;

      if (pairData.token0 == WETH.networks[id].address) {
        ewt_reserve = web3.utils.fromWei(pairData._reserve0);
        tka_reserve = web3.utils.fromWei(pairData._reserve1);
      } else {
        tka_reserve = web3.utils.fromWei(pairData._reserve0);
        ewt_reserve = web3.utils.fromWei(pairData._reserve1);
      }

      console.log(`
    
    
    `);

      console.log(`
    ADD[3] has ${web3.utils.fromWei(user_balance_token_llp)} ETH-A LP 
    `);

      //? Data for ANAL Remove Liquidity

      const balanceToken0 = await tokenA.methods.balanceOf(llp_WETH_A).call();
      const balanceToken1 = await weth.methods.balanceOf(llp_WETH_A).call();

      const balance = await pair_eth_a.methods.balanceOf(addresses[2]).call();
      const _balance = await token_llp.methods.balanceOf(addresses[2]).call();

      const totalS = await pair_eth_a.methods.totalSupply().call();

      let withAmount = web3.utils.fromWei(_balance) * 0.5;

      console.log("No Wei: ", withAmount);

      //? (End) Data for ANAL Remove Liquidity
      const bnRemove = "100";

      const approved = await pair_eth_a.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[2],
          gas: gas,
        });

      console.log('Approved ETH-TKA LP "manipulation"');

      //? EXTRA
      const liquidity = await pair_eth_a.methods.balanceOf(llp_WETH_A).call();

      console.log(liquidity);
      console.log(web3.utils.fromWei(liquidity));
      //?
      amount = web3.utils.toWei(withAmount.toString(), "ether");

      await router.methods
        .removeLiquidityETH(
          TokenA.networks[id].address,
          amount,
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas });

      console.log("Could Remove (50%) Liquidity ETH-TKA");

      const endBal = await token_llp.methods.balanceOf(addresses[2]).call();
      console.log(`User has: ${web3.utils.fromWei(endBal)} ETH-TKA LP`);
    } catch (e) {
      console.log("ERROR: Removing Liquidity For ETH-TKA");
      console.log(e);
    }
  }, 35 * 1000);

  setTimeout(async () => {
    //! Remove Liquidity (because TradingFees are minted when user ADDs/Withdraws Liquidity)

    try {
      const llp_WEWT_A = await factory.methods
        .getPair(WETH.networks[id].address, Sushi.networks[id].address)
        .call();

      console.log(`Removing Liquidity of: ${llp_WEWT_A}`);

      const token_llp = new web3.eth.Contract(UniswapV2ERC20.abi, llp_WEWT_A);

      const user_balance_token_llp = await token_llp.methods
        .balanceOf(addresses[2])
        .call();

      const pair_ewt_a = new web3.eth.Contract(Pair.abi, llp_WEWT_A);

      const _balance = await token_llp.methods.balanceOf(addresses[2]).call();

      let withAmount = web3.utils.fromWei(_balance) * 0.5;

      const bnRemove = "100";

      const approved = await pair_ewt_a.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[2],
          gas: gas,
        });

      console.log('Approved ETH-XDYE LP "manipulation"');

      //? EXTRA
      const liquidity = await pair_ewt_a.methods.balanceOf(llp_WEWT_A).call();

      console.log(liquidity);
      console.log(web3.utils.fromWei(liquidity));
      //?
      amount = web3.utils.toWei(withAmount.toString(), "ether");

      await router.methods
        .removeLiquidityETH(
          Sushi.networks[id].address,
          amount,
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas });

      console.log("Could Remove (50%) Liquidity ETH-XDYE");

      const endBal = await token_llp.methods.balanceOf(addresses[2]).call();
      console.log(`User has: ${web3.utils.fromWei(endBal)} ETH-XDYE LP`);
    } catch (e) {
      console.log("ERROR: Removing Liquidity on Pair ETH-XDYE");
      console.log(e);
    }
  }, 37 * 1000);

  setTimeout(async () => {
    //! Remove Liquidity (because TradingFees are minted when user ADDs/Withdraws Liquidity)

    try {
      const llp_WEWT_A = await factory.methods
        .getPair(TokenA.networks[id].address, TokenB.networks[id].address)
        .call();

      console.log(`Removing Liquidity of: ${llp_WEWT_A}`);

      const token_llp = new web3.eth.Contract(UniswapV2ERC20.abi, llp_WEWT_A);

      const pair_eth_a = new web3.eth.Contract(Pair.abi, llp_WEWT_A);

      const _balance = await token_llp.methods.balanceOf(addresses[2]).call();

      let withAmount = web3.utils.fromWei(_balance) * 0.5;

      // withAmount = Math.trunc(withAmount).toString()

      console.log("No Wei: ", withAmount);

      //? (End) Data for ANAL Remove Liquidity
      const bnRemove = "100";

      const approved = await pair_eth_a.methods
        .approve(
          Router.networks[id].address,
          web3.utils.toBN(2).pow(web3.utils.toBN(256)).sub(web3.utils.toBN(1))
        )
        .send({
          from: addresses[2],
          gas: gas,
        });

      console.log('Approved TKA-TKB LP "manipulation"');

      //? EXTRA
      const liquidity = await pair_eth_a.methods.balanceOf(llp_WEWT_A).call();

      console.log(liquidity);
      console.log(web3.utils.fromWei(liquidity));
      //?
      amount = web3.utils.toWei(withAmount.toString(), "ether");

      await router.methods
        .removeLiquidity(
          TokenA.networks[id].address,
          TokenB.networks[id].address,
          amount,
          0,
          0,
          addresses[2],
          Math.floor(Date.now() / 1000) + 60 * 10
        )
        .send({ from: addresses[2], gas: gas });

      console.log("Could Remove (50%) Liquidity TKA-TKB");

      const endBal = await token_llp.methods.balanceOf(addresses[2]).call();
      console.log(`User has: ${web3.utils.fromWei(endBal)} TKA-TKB LP`);
    } catch (e) {
      console.log("ERROR: Removing Liquidity TKA-TKB");
      console.log(e);
    }
  }, 39 * 1000);

  setTimeout(async () => {
    try {
      await xdyeMaker.methods
        .convert(WETH.networks[id].address, TokenA.networks[id].address)
        .send({
          from: addresses[4],
          gas: gas,
        });
      console.log("Could Execute: XDYE Maker convert() ");
    } catch (e) {
      console.log("FAILED ON XDYE MAKER CONVERT");
      console.log(e);
    }
  }, 44 * 1000);

  setTimeout(async () => {
    try {
      await xdyeMaker.methods
        .convert(TokenA.networks[id].address, TokenB.networks[id].address)
        .send({
          from: addresses[5],
          gas: gas,
        });
      console.log("Could Execute: XDYE Maker convert() ");
    } catch (e) {
      console.log("FAILED ON XDYE MAKER CONVERT");
      console.log(e);
    }
  }, 46 * 1000);

  setTimeout(async () => {
    try {
      await xdyeMaker.methods
        .convert(WETH.networks[id].address, Sushi.networks[id].address)
        .send({
          from: addresses[5],
          gas: gas,
        });
      console.log("Could Execute: XDYE Maker convert() ");
    } catch (e) {
      console.log("FAILED ON XDYE MAKER CONVERT");
      console.log(e);
    }
  }, 48 * 1000);

  //! Sushi Bar (User approach) deposit SUSHI --> get xSUSHI, then xSUSHI to SUSHI (increase SUSHI amount?)

  //* SWAPs WEWT --> EWT (Fee)
  // setTimeout(async () => {
  //   try {
  //     const wrappedETH = await wewt.methods.balanceOf(addresses[9]).call()

  //     const goodBal = new web3.utils.BN(wrappedETH.toString()) //? 10

  //     //! APPROVE WETH Contract to handle tokens

  //     const approve = wewt.methods
  //       .approve(WETH_ADDRESS, goodBal)
  //       .send({ from: addresses[9], gas: gas })

  //     console.log(approve)
  //     console.log('APPROVED')
  //     console.log('APPROVED')
  //     console.log('APPROVED')

  //     const balancePreWithdraw = await web3.eth.getBalance(addresses[9])

  //     await wewt.methods.withdraw(goodBal).send({
  //       from: addresses[9],
  //       gas: gas,
  //     })
  //     console.log('Could convert WEWT --> EWT on my FEE')

  //     const balancePostWithdraw = await web3.eth.getBalance(addresses[9])

  //     console.log(`

  //     My Fee ADD[9] (PreGetFee): ${web3.utils.fromWei(balancePreWithdraw)} EWT
  //     My Fee ADD[9] (PostGetFee): ${web3.utils.fromWei(balancePostWithdraw)} EWT

  //     Result EWT Fee Profit: ${
  //       web3.utils.fromWei(balancePostWithdraw) -
  //       web3.utils.fromWei(balancePreWithdraw)
  //     } EWT

  //     `)
  //   } catch (e) {
  //     console.log('ERROR: When converting WEWT --> EWT on my FEE')
  //     console.log(e)
  //   }
  // }, 45 * 1000)
  //* END: SWAPs WEWT --> EWT (Fee)

  //! Check if SYST. ARQUITECTURE worked

  setTimeout(async () => {
    try {
      const add3_sushi_in_bar = await xdyeBar.methods
        .balanceOf(addresses[3])
        .call();
      await xdyeBar.methods
        .leave(add3_sushi_in_bar)
        .send({ from: addresses[3], gas: gas });

      console.log("✅ Could leave XDYE Bar");

      const sushiPostBar = await xdye.methods.balanceOf(addresses[3]).call();

      console.log(`
      
      _ Post XDYE Bar Summary _

      ADD[3]:  ${web3.utils.fromWei(sushiPostBar)} XDYE        
      
      `);
    } catch (e) {
      console.log("ERROR: While checking FINAL DATA");
      console.log(e);
    }
  }, 50 * 1000);

  setTimeout(async () => {
    try {
      const addressPair = await factory.methods
        .getPair(WETH.networks[id].address, TokenA.networks[id].address)
        .call();
      const addressPair_1 = await factory.methods
        .getPair(WETH.networks[id].address, Sushi.networks[id].address)
        .call();
      const addressPair_2 = await factory.methods
        .getPair(WETH.networks[id].address, TokenB.networks[id].address)
        .call();
      const addressPair_3 = await factory.methods
        .getPair(TokenA.networks[id].address, TokenB.networks[id].address)
        .call();
      const ewt_tka_lp_contract = new web3.eth.Contract(tokenABI, addressPair);
      const ewt_sushi_lp_contract = new web3.eth.Contract(
        tokenABI,
        addressPair_1
      );
      const ewt_tkb_lp_contract = new web3.eth.Contract(
        tokenABI,
        addressPair_2
      );
      const tka_tkb_lp_contract = new web3.eth.Contract(
        tokenABI,
        addressPair_3
      );

      const balFee = await weth.methods.balanceOf(addresses[9]).call();
      const balFee_ = await web3.eth.getBalance(addresses[9]);
      const balFee__ = await xdye.methods.balanceOf(addresses[9]).call();
      const _balFee = await ewt_tka_lp_contract.methods
        .balanceOf(addresses[9])
        .call();

      const __balFee = await ewt_sushi_lp_contract.methods
        .balanceOf(addresses[9])
        .call();

      console.log(`
      
      _ MY FEES Summary _

      ADD[9]: ${web3.utils.fromWei(_balFee)} LP (ETH-TKA)
      ADD[9]: ${web3.utils.fromWei(__balFee)} LP (ETH-XDYE)
      ADD[9]: ${web3.utils.fromWei(balFee__)} XDYE        
      ADD[9]: ${web3.utils.fromWei(balFee)} WETH        
      ADD[9]: ${web3.utils.fromWei(balFee_) - 100} ETH (real Profit)
      
      `);

      const lmnFee = await weth.methods.balanceOf(addresses[8]).call();
      const lmnFee_ = await web3.eth.getBalance(addresses[8]);
      const lmnFee__ = await xdye.methods.balanceOf(addresses[8]).call();
      const _lmnFee = await ewt_tka_lp_contract.methods
        .balanceOf(addresses[8])
        .call();

      const __lmnFee = await ewt_sushi_lp_contract.methods
        .balanceOf(addresses[8])
        .call();

      console.log(`
      
      _ Lemonade FEES Summary _

      Lemon Fee[8]: ${web3.utils.fromWei(_lmnFee)} LP (ETH-TKA)
      Lemon Fee[8]: ${web3.utils.fromWei(__lmnFee)} LP (ETH-XDYE)
      Lemon Fee[8]: ${web3.utils.fromWei(lmnFee__)} XDYE        
      Lemon Fee[8]: ${web3.utils.fromWei(lmnFee)} WETH       
      Lemon Fee[8]: ${web3.utils.fromWei(lmnFee_) - 100} ETH (real Profit)
      
      `);

      const sushiMaker_sushi = await xdye.methods
        .balanceOf(SushiMaker.networks[id].address)
        .call();
      const sushiMaker_ewt = await web3.eth.getBalance(
        SushiMaker.networks[id].address
      );
      const sushiMaker_wewt = await weth.methods
        .balanceOf(SushiMaker.networks[id].address)
        .call();
      const sushiMaker_ewt_tka_lp = await ewt_tka_lp_contract.methods
        .balanceOf(SushiMaker.networks[id].address)
        .call();
      const sushiMaker_ewt_sushi_lp = await ewt_sushi_lp_contract.methods
        .balanceOf(SushiMaker.networks[id].address)
        .call();
      const sushiMaker_ewt_tkb_lp = await ewt_tkb_lp_contract.methods
        .balanceOf(SushiMaker.networks[id].address)
        .call();
      const sushiMaker_tka_tkb_lp = await tka_tkb_lp_contract.methods
        .balanceOf(SushiMaker.networks[id].address)
        .call();

      console.log(`
      
      _ XdYe Maker Summary _

      XdYeMaker ADD: ${web3.utils.fromWei(sushiMaker_ewt_tka_lp)} LP (ETH-TKA)
      XdYeMaker ADD: ${web3.utils.fromWei(
        sushiMaker_ewt_sushi_lp
      )} LP (ETH-XDYE)
      XdYeMaker ADD: ${web3.utils.fromWei(sushiMaker_ewt_tkb_lp)} LP (ETH-TKB)
      XdYeMaker ADD: ${web3.utils.fromWei(sushiMaker_tka_tkb_lp)} LP (TKA-TKB)
      XdYeMaker ADD: ${web3.utils.fromWei(sushiMaker_sushi)} XDYE        
      XdYeMaker ADD: ${web3.utils.fromWei(sushiMaker_wewt)} WETH 
      XdYeMaker ADD: ${web3.utils.fromWei(sushiMaker_ewt)} ETH (real Profit)
      
      `);

      const sushiBar_sushi = await xdye.methods
        .balanceOf(SushiBar.networks[id].address)
        .call();
      const sushiBar_ewt = await web3.eth.getBalance(
        SushiBar.networks[id].address
      );
      const sushiBar_wewt = await weth.methods
        .balanceOf(SushiBar.networks[id].address)
        .call();
      const sushiBar_ewt_tka_lp = await ewt_tka_lp_contract.methods
        .balanceOf(SushiBar.networks[id].address)
        .call();

      console.log(`
      
      _ XdYe Bar Summary _

      XdYeBar ADD: ${web3.utils.fromWei(sushiBar_ewt_tka_lp)} LP (ETH-TKA)
      XdYeBar ADD: ${web3.utils.fromWei(sushiBar_sushi)} XDYE        
      XdYeBar ADD: ${web3.utils.fromWei(sushiBar_wewt)} WETH 
      XdYeBar ADD: ${web3.utils.fromWei(sushiBar_ewt)} ETH (real Profit)
      
      `);
    } catch (e) {
      console.log("ERROR: While checking FINAL DATA");
      console.log(e);
    }
  }, 55 * 1000);
};

const getFactoryCodeHashVOLTA = async () => {
  // const web3 = new Web3("http://localhost:8545");

  const wallet = new HDWalletProvider(
    [process.env.MNEMONIC],
    "https://volta-rpc.energyweb.org"
  );

  const web3 = new Web3(wallet);

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const factory = new web3.eth.Contract(
    Factory.abi,
    "0x87FE22Ebf8a09B28E41B3B6F4f672eF423e6B163"
  );

  //TODO: Smart Contracts Main Declaration

  try {
    const init_code_hash = await factory.methods.pairCodeHash().call();

    console.log("Factory Init Code Hash: " + init_code_hash);
    // AQUI
  } catch (e) {
    console.log(e);
    console.log("Something occured while fetching  INIT:CODE:HASH");
  }
};

const setFeeToMaker = async () => {
  // const web3 = new Web3("http://localhost:8545");

  const wallet = new HDWalletProvider(
    [process.env.MNEMONIC],
    "https://volta-rpc.energyweb.org"
  );

  const web3 = new Web3(wallet);

  const id = await web3.eth.net.getId();
  console.log(id);

  const gas = new web3.utils.BN("6000000");

  const addresses = await web3.eth.getAccounts();

  const factory = new web3.eth.Contract(
    Factory.abi,
    "0x87FE22Ebf8a09B28E41B3B6F4f672eF423e6B163"
  );

  //TODO: Smart Contracts Main Declaration

  try {
    await factory.methods
      .setFeeTo("0xea40A0597Bd2d540d5B560F6700141E046e94F8F")
      .send({ from: addresses[0], gas: gas });

    console.log("Fee was set to Sushi Maker");
    // AQUI
  } catch (e) {
    console.log(e);
    console.log("Something occured while Setting FEE to Maker");
  }
};

const getFactoryXDYE_EWTPair = async () => {
  const wallet = new HDWalletProvider(
    [process.env.MNEMONIC],
    "https://volta-rpc.energyweb.org"
  );

  const web3 = new Web3(wallet);

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const factory = new web3.eth.Contract(
    Factory.abi,
    "0x87FE22Ebf8a09B28E41B3B6F4f672eF423e6B163"
  );

  const pairAddress = await factory.methods
    .getPair(
      //! XDYE -EWT
      "0x79b6d4dB6b8d09Ea4EBA308B83639A7E691FE05B",
      "0xd89500d7033Ff9cfbaB4e4ef735900A6f0B23b0C"
    )
    .call();

  console.log("EWT-XDYE Address: " + pairAddress);
};

const transferXDYEOwnership = async () => {
  const wallet = new HDWalletProvider(
    [process.env.MNEMONIC],
    "https://volta-rpc.energyweb.org"
  );

  const web3 = new Web3(wallet);

  const id = await web3.eth.net.getId();
  console.log(id);

  const gas = new web3.utils.BN("6000000");

  const addresses = await web3.eth.getAccounts();

  const sushiToken = new web3.eth.Contract(
    Sushi.abi,
    "0xbBee4Fe9715374c2C6E402138f9B23810Af29CC8"
  );

  try {
    await sushiToken.methods
      .transferOwnership("0xCbcfDcACc9ACf03BfdE1bA417b7086c5DD642E0E")
      .send({
        from: addresses[0],
        gas: gas,
      });

    console.log("XDYE Ownership Transfered to MasterChef");
  } catch (e) {
    console.log("Error transfering Ownership to MasterChef");
    console.log(" ");
    console.log(" ");
    console.log(e);
  }
};

const getPairValuesFromFactory = async () => {
  const wallet = new HDWalletProvider(
    [process.env.MNEMONIC],
    "https://volta-rpc.energyweb.org"
  );

  const web3 = new Web3(wallet);

  const id = await web3.eth.net.getId();
  console.log(id);

  const addresses = await web3.eth.getAccounts();

  const factory = new web3.eth.Contract(
    Factory.abi,
    "0x87FE22Ebf8a09B28E41B3B6F4f672eF423e6B163"
  );

  const tka_ewt_pair = await factory.methods
    .getPair(
      //! TOKEN_A -EWT
      "0xFB4d886EAd0169DafAE865bc928E8c05aAdB7178",
      "0xd89500d7033Ff9cfbaB4e4ef735900A6f0B23b0C"
    )
    .call();

  console.log("EWT-TKA Address: " + tka_ewt_pair);

  const tkb_ewt_pair = await factory.methods
    .getPair(
      //! TOKEN_B -EWT
      "0x6Ec7FeaD4186247e364A8D349247fdF8CAB070d6",
      "0xd89500d7033Ff9cfbaB4e4ef735900A6f0B23b0C"
    )
    .call();

  console.log("EWT-TKB Address: " + tkb_ewt_pair);
};

//* Crea un PAIR, afegeix liquidez, fa un trade, checks Fee gets to MyFee + (sushiBar ++ LMD)
// checkProcessorWorksInStructure()

// playingWithRestaurant()

// testMasterChef()

// poolRatioCheck()

//

// sendTokensToFrontEndTester()

// sendETHToMetamask()

// sendLMDToRestaurant()

// transferSushiOwnership()

// createMasterChefPools() //! Trigger after both pairs ARE Created

// createPairOnFactory()

// checkMCLength()

//TODO: Lemonade mainnet functions

//? lemonade_setFeeTo('0x6A05622629fB411CD6B76dB5E326de2eab0713cE') <-- localDev[0] has te power

//TODO: XdYe Functions

// getFactoryCodeHash();
// createPairOnXdYeFactory();
// checkFactoryFeesEdit();
// addAndRemoveLiquidity();
// checkETHWrapAndUnwrap();
// xdyeTokenTest();
// masterChefTesting();
// barTesting();
// checkXdYeMaker();
// checkUnlocker();
// checkEverythingIsWorkingOnXdYe();

//TODO END: XdYe Functions

// getFactoryCodeHashVOLTA();
// setFeeToMaker();
// getFactoryXDYE_EWTPair();
getPairValuesFromFactory();
// transferXDYEOwnership();
