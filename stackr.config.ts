import { KeyPurpose, SignatureScheme, StackrConfig } from "@stackr/sdk";
import dotenv from "dotenv";

dotenv.config();

// this file is generated by the deployment script
import * as deployment from "./deployment.json";
const REGISTRY_CONTRACT = "0x7c77571d6f299a741d754f7467decd2c73bf673e";

const stackrConfig: StackrConfig = {
  stackrApp: {
    appId: deployment.appId,
    appInbox: deployment.appInbox,
  },
  sequencer: {
    batchSize: 16,
    batchTime: 1000,
  },
  syncer: {
    slotTime: 1000,
    vulcanRPC: process.env.VULCAN_RPC as string,
    L1RPC: process.env.L1_RPC as string,
  },
  operator: {
    accounts: [
      {
        privateKey: process.env.PRIVATE_KEY as string,
        purpose: KeyPurpose.BATCH,
        scheme: SignatureScheme.ECDSA,
      },
    ],
  },
  domain: {
    name: "BasicDEX",
    version: "1",
    chainId: deployment.chainId,
    verifyingContract: deployment.appInbox,
    salt: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  },
  datastore: {
    uri: "./db.sqlite",
  },
  registryContract: REGISTRY_CONTRACT,
  logLevel: "error",
};

export { stackrConfig };
