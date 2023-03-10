import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import getCampaign from "../ethereum/campaign";
import { Link } from "../routes";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    const campaignsManagerList = [];
    for (let address of campaigns) {
      const manager = await getCampaign(address).methods.manager().call();
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
            <Link route={`/campaigns/${campaignsManager.address}`}>
              <a>View Campaign</a>
            </Link>
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
          <Link route="/campaigns/new">
            <a>
              <Button
                floated="right"
                content="Create Campaign"
                icon="add"
                primary
              />
            </a>
          </Link>
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
