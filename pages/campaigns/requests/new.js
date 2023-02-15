import React, { Component } from "react";
import { Form, Button, Message, Input, Progress } from "semantic-ui-react";
import getCampaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";
import Layout from "../../../components/Layout";

class RequestNew extends Component {
  state = {
    value: "",
    description: "",
    recipient: "",
    errorMessage: "",
    progressPercent: 0,
  };

  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }

  onSubmit = async (event) => {
    if (this.state.progressPercent === 0) {
      event.preventDefault();

      this.setState({ errorMessage: "" });
      try {
        this.incrementProgressPercent();
        const campaign = getCampaign(this.props.address);
        this.incrementProgressPercent();
        const description = this.state.description;
        this.incrementProgressPercent();
        const value = this.state.value;
        this.incrementProgressPercent();
        const recipient = this.state.recipient;
        this.incrementProgressPercent();
        const eth = web3.eth;
        this.incrementProgressPercent();
        const accounts = await eth.getAccounts();
        this.incrementProgressPercent();
        const from = accounts[0];
        this.incrementProgressPercent();
        const methods = campaign.methods;
        this.incrementProgressPercent();
        const ether = web3.utils.toWei(value, "ether");
        this.incrementProgressPercent();
        await methods
          .createRequest(description, ether, recipient)
          .send({ from: from });
        Router.pushRoute(`/campaigns/${this.props.address}/requests`);
      } catch (e) {
        this.setState({ errorMessage: e.message, progressPercent: 0 });
      }
    }
  };

  incrementProgressPercent = () => {
    this.setState((prevState) => ({
      progressPercent: prevState.progressPercent + 10,
    }));
  };

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <h3>Create a Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Value in Ether</label>
            <Input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient Address</label>
            <Input
              value={this.state.recipient}
              onChange={(event) =>
                this.setState({ recipient: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="Opps!" content={this.state.errorMessage} />
          <Button primary loading={this.state.progressPercent > 0}>
            Create!
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

export default RequestNew;
