import React, { Component } from "react";
import { Form, Input, Message, Button, Progress } from "semantic-ui-react";
import getCampaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class ContributeForm extends Component {
  state = { errorMessage: "", progressPercent: 0, value: "" };

  onSubmit = async (event) => {
    event.preventDefault();
    const campaign = getCampaign(this.props.address);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });
      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (e) {}
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            label="ether"
            labelPosition="right"
            value={this.state.value}
            onChange={(event) => this.setState({ value: event.target.value })}
          />
        </Form.Field>
        <Button primary loading={this.state.progressPercent > 0}>
          Contribute!
        </Button>
        <Progress
          percent={this.state.progressPercent}
          indicating
          style={{ marginTop: "10px" }}
          error={!!this.state.errorMessage}
        />
      </Form>
    );
  }
}

export default ContributeForm;
