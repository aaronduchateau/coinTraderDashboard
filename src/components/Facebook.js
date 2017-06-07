import React, { Component } from 'react';
import $ from 'jquery';

const Styles = {
  flexContainer: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%'
  },
  tableContent: {
    textAlign: 'center'
  },
  image: {
    display: 'block',
    margin: '0 auto 20px'
  },
  title: {
    display: 'block',
    fontSize: '2em',
    fontWeight: 700
  },
  subtitle: {
    fontSize: '1em',
    fontWeight: 300
  },
  th: {
    padding: '20px'
  }
};

export default class Facebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      altCoinData: []
    };
    this.fetchData = this.fetchData.bind(this);
  }

  getInitialState() {
    return({
      altCoinData: []
    });
  }

  componentDidMount() {
    //this.fetchData();
    this.dataTimer = setInterval(this.fetchData, 4000);
  }

  componentWillUnmount() {
    clearInterval(this.dataTimer);
  }

  fetchData() {
    console.log('called');
    $.get( "/altcoindata", ( data ) => {
        console.log('ddd')
        console.log(data);
        this.setState({altCoinData: data});
    });
  }

  render() {
    const coinData = this.state.altCoinData; 
    return (
      <div style={Styles.flexContainer}>
        <div style={Styles.tableContent}>
          <table className="table table-striped">
            <thead>
              <tr>
                <th style={Styles.th}>Display Name</th>
                <th style={Styles.th}>Market Exchange Code</th>
                <th style={Styles.th}>Last Price</th>
                <th style={Styles.th}>Trading Volume</th>
                <th style={Styles.th}>BTC Trading Volume</th>
                <th style={Styles.th}>Time of Metric</th>
              </tr>
            </thead>
            <tbody>
            {coinData.map((row) => {
              return (
                <tr>
                  <td>{row.display_name}</td>
                  <td>{row.exch_code}</td>
                  <td>{row.last_price}</td>
                  <td>{row.volume_24}</td>
                  <td>{row.btc_volume_24}</td>
                  <td>{row.updatedAt}</td>
                </tr> 
              );  
            })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

Facebook.propTypes = {
  subtitle: React.PropTypes.string,
  title: React.PropTypes.string
};

Facebook.defaultProps = {
  title: 'Default Title',
  subtitle: 'Default Subtitle'
};
