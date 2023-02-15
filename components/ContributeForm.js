import React, { Component } from "react";
import { Form, Input, Message, Button, Progress } from "semantic-ui-react";
import getCampaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class ContributeForm extends Component {
  state = { errorMessage: "", progressPercent: 0, value: "" };

  onSubmit = async (event) => {
    if (this.state.progressPercent === 0) {
      event.preventDefault();
      this.setState({ errorMessage: "" });
      try {
        this.incrementProgressPercent();
        const campaign = getCampaign(this.props.address);
        this.incrementProgressPercent();
        const eth = web3.eth;
        this.incrementProgressPercent();
        const accounts = await eth.getAccounts();
        this.incrementProgressPercent();
        const methods = campaign.methods;
        this.incrementProgressPercent();
        const contribute = methods.contribute();
        this.incrementProgressPercent();
        await contribute.send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.value, "ether"),
        });
        this.incrementProgressPercent();
        Router.replaceRoute(`/campaigns/${this.props.address}`);
      } catch (e) {
        this.setState({ errorMessage: e.message });
      }
      this.setState({ value: "", progressPercent: 0 });
    }
  };

  incrementProgressPercent = () => {
    this.setState((prevState) => ({
      progressPercent: prevState.progressPercent + 15,
    }));
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            label="ether"
            labelPosition="right"
            value={this.state.value}
            onChange={(event) => this.setState({ value: event.target.value })}
          />
        </Form.Field>
        <Message error header="Opps!" content={this.state.errorMessage} />
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
