import React, { Component } from "react";
import Layout from "../../components/Layout";
import getCampaign from "../../ethereum/campaign";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = getCampaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();
    console.log("summary:");
    console.log(summary);
    return {};
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
      </Layout>
    );
  }
}

export default CampaignShow;
