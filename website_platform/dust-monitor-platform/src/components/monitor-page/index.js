import React from 'react'
import GoogleMap from '../map'
import RightPanel from '../right-panel'
import firebase from "../../firebase";

export default class MonitorPage extends React.Component {
    state = {
        node: 'No_1',
        sensorData: [],
        lastUpdateTime: ''
    }

    getLatestData = (node) => {
        const sensorNodesRef = firebase.database().ref(node);

        sensorNodesRef.limitToLast(1).on('value', (measures) => {
            let sensorValues = measures.val()
            let data = []
            Object.keys(sensorValues).forEach(function (value) {
                data.push(
                    {key: "Temperature (°C)", value: sensorValues[value].Temp},
                    {key: "Humidity (%)", value: sensorValues[value].Humid},
                    {key: "PM 1.0 (µg/m³)", value: sensorValues[value].PM_1_0},
                    {key: "PM 2.5 (µg/m³)", value: sensorValues[value].PM_2_5},
                    {key: "PM 10 (µg/m³)", value: sensorValues[value].PM_10},
                )
            })
            this.setState({sensorData: data, lastUpdateTime: Object.keys(sensorValues)[0]})
        })
    }

    updateTable() {
        clearInterval(this.updateTableIntervalId);
        setTimeout(() => {
                this.updateTableIntervalId = setInterval(this.getLatestData(this.state.node), 10000)
            }, 500
        )
    }

    handleChangeNode = event => {
        this.setState({node: event.target.value});
        this.updateTable()
    };

    onMarkerClick = name => {
        this.setState({node: name})
        this.updateTable()
    };

    componentDidMount() {
        this.updateTableIntervalId = setInterval(this.getLatestData(this.state.node), 10000)
    }

    render() {
        return (
            <div style={{position: 'relative', height: '85vh'}}>
                <div style={{position: 'absolute', left: 0, top: 0, width: '62%', height: '100%'}}>
                    <GoogleMap onMarkerClick={this.onMarkerClick} sensorData={this.state.sensorData}/>
                </div>
                <div style={{position: 'absolute', right: 0, top: 0, width: '38%', height: '100%'}}>
                    <RightPanel onSelectNode={this.handleChangeNode}
                                node={this.state.node}
                                sensorData={this.state.sensorData}
                                lastUpdateTime={this.state.lastUpdateTime}
                    />
                </div>
            </div>
        )
    }
}