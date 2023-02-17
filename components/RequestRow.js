import React, { Component } from "react";
import { Table, Button, Icon } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import getCampaign from "../ethereum/campaign";

class RequestRow extends Component {
  onApproveOrDisapprove = async (isApprove) => {
    const campaign = getCampaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    if (isApprove) {
      await campaign.methods
        .approveRequest(this.props.id)
        .send({ from: accounts[0] });
    } else {
      await campaign.methods
        .disapproveRequest(this.props.id)
        .send({ from: accounts[0] });
    }
  };

  renderCompleteIcon(complete) {
    if (complete) {
      return <Icon name="check" color="green" size="large" />;
    }
    return <Icon name="close" color="red" size="big" />;
  }

  onFinalize = async () => {
    const campaign = getCampaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods
      .finalizeRequest(this.props.id)
      .send({ from: accounts[0] });
  };

  renderYesCount(complete, yesCount, balance) {
    if (!complete) {
      return String((yesCount / balance) * 100).slice(0, 5) + "%";
    }
  }

  renderNoCount(complete, noCount, balance) {
    if (!complete) {
      return String((noCount / balance) * 100).slice(0, 5) + "%";
    }
  }

  renderRateOfVotes(complete, yesCount, noCount, balance) {
    if (!complete) {
      const rateOfVotes =
        ((parseInt(yesCount) + parseInt(noCount)) / balance) * 100;
      let text;
      if (rateOfVotes >= 100) {
        text = 100;
      } else {
        text = rateOfVotes;
      }
      return String(text).slice(0, 5) + "%";
    }
  }

  render() {
    const { Row, Cell } = Table;
    const { id, request, balance } = this.props;
    const readyToFinalize =
      parseInt(request.yesCount) + parseInt(request.noCount) > balance / 2 &&
      request.yesCount > request.noCount &&
      !request.complete;

    return (
      <Row disabled={request.complete} positive={readyToFinalize}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {this.renderYesCount(request.complete, request.yesCount, balance)}
        </Cell>
        <Cell>
          {this.renderNoCount(request.complete, request.noCount, balance)}
        </Cell>
        <Cell>
          {this.renderRateOfVotes(
            request.complete,
            request.yesCount,
            request.noCount,
            balance
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              color="green"
              basic
              onClick={() => this.onApproveOrDisapprove(true)}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              color="red"
              basic
              onClick={() => this.onApproveOrDisapprove(false)}
            >
              Disapprove
            </Button>
          )}
        </Cell>
        <Cell>{this.renderCompleteIcon(request.complete)}</Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="teal" basic onClick={this.onFinalize}>
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
