import { REQUIRE, STF, Transitions } from "@stackr/sdk/machine";
import { DEXState } from "./machine";
import { ZeroAddress } from "ethers";


const init: STF<DEXState> = {
  handler: ({ state, msgSender, inputs }) => {
    const { eth, usdc } = inputs;

    /* 
      1. Calculate the amount of liquidity to mint for the user. 
        - Math.sqrt(amount0.mul(amount1)).sub(MINIMUM_LIQUIDITY);
      2. Lock a minimum liquidity amount to ZeroAddress
      3. Mint liquidity to user.
      4. Update the reserves data.
      5. Calculate kLast.
    */

    REQUIRE(!state.pool.init, "INIT :: POOL ALREADY INIT");

    const accountIdx = state.balances.findIndex(account => account.wallet === msgSender);
    REQUIRE(accountIdx > - 1, "INIT :: USER NOT FOUND");

    const shares = Math.sqrt(eth * usdc) - state.pool.minLiquidity;

    // Lock minimum liquidity to address(0);
    state.balances.push({
      wallet: ZeroAddress,
      balances: {
        eth: 0,
        usdc: 0,
        shares: state.pool.minLiquidity
      }
    })

    // Update balances for the user. 
    state.balances[accountIdx].balances.shares = shares;
    state.balances[accountIdx].balances.eth -= eth;
    state.balances[accountIdx].balances.usdc -= usdc;

    // Update pool status.
    state.pool.init = true;
    state.pool.ethReserve = eth;
    state.pool.usdcReserve = usdc;
    state.pool.totalShares = shares;
    state.pool.kLast = state.pool.ethReserve * state.pool.usdcReserve;


    return state;
  }
}

const supply: STF<DEXState> = {
  handler: ({ state, msgSender, inputs }) => {

    return state;
  }
}

const withdraw: STF<DEXState> = {
  handler: ({ state }) => {
    return state;
  }
}

const swap: STF<DEXState> = {
  handler: ({ state }) => {
    return state;
  }
}

export const transitions: Transitions<DEXState> = {
  init,
  supply,
  withdraw,
  swap
};
