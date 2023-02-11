import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server Or the user is not running metamask
  web3 = new Web3(new Web3.providers.HttpProvider(process.env.infuraAPI));
}

export default web3;
