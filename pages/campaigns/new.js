import React, { Component } from "react";
import { Form, Button, Input, Message, Progress } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

class CampaignNew extends Component {
  state = {
    minContribution: "",
    errorMessage: "",
    progressPercent: 0,
  };

  onSubmit = async (event) => {
    if (this.state.progressPercent === 0) {
      event.preventDefault();

      this.setState({ errorMessage: "" });
      try {
        this.incrementProgressPercent();
        const eth = web3.eth;
        this.incrementProgressPercent();
        const accounts = await eth.getAccounts();
        this.incrementProgressPercent();
        const methods = factory.methods;
        this.incrementProgressPercent();
        const createCampaign = methods.createCampaign(
          this.state.minContribution
        );
        this.incrementProgressPercent();
        await createCampaign.send({ from: accounts[0] });
        Router.pushRoute("/");
      } catch (e) {
        this.setState({ errorMessage: e.message });
        this.setState({ progressPercent: 0 });
      }
    }
  };

  incrementProgressPercent = () => {
    this.setState((prevState) => ({
      progressPercent: prevState.progressPercent + 17,
    }));
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minContribution}
              onChange={(event) =>
                this.setState({ minContribution: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.progressPercent > 0}>
            Create
          </Button>
          <Progress
            percent={this.state.progressPercent}
            indicating
            style={{ marginTop: "10px" }}
            error={!!this.state.errorMessage}
          />
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
