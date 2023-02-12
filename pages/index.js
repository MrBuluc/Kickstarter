import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/build/Campaign.json";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    const campaignsManagerList = [];
    for (let address of campaigns) {
      const manager = await new web3.eth.Contract(
        JSON.parse(Campaign.interface),
        address
      ).methods
        .manager()
        .call();
      campaignsManagerList.push({ address, manager });
    }
    return { campaignsManagerList };
  }

  renderCampaigns() {
    const items = this.props.campaignsManagerList.map((campaignsManager) => {
      return {
        header: campaignsManager.address,
        description: (
          <div>
            <h4>Manager: {campaignsManager.manager}</h4>
            <a>View Campaign</a>
          </div>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>
          <Button
            floated="right"
            content="Create Campaign"
            icon="add"
            primary
          />
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
