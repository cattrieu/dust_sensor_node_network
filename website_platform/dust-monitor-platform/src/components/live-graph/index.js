import React from 'react';
import Plot from 'react-plotly.js';
import firebase from "../../firebase";

const screenwidth = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

const indexLabel = {
    'Temp': "Temperature (°C)",
    'Humid': "Humidity (%)",
    'PM_1_0': "PM 1.0 (µg/m³)",
    'PM_2_5': "PM 2.5 (µg/m³)",
    'PM_10': "PM 10 (µg/m³)",
}

export default class Graph extends React.Component {
    state = {
        line: {
            x: [],
            y: [],
            name: 'Line'
        },
        layout: {
            datarevision: 0,
            width: screenwidth,
            margin: {
                l: 50,
                r: 50,
                t: 10,
                b: 100,
                pad: 4,
            }
        },
        revision: 0,
    }

    getLiveData = (node, index) => {
        const {line, layout} = this.state
        const sensorNodesRef = firebase.database().ref(node);
        sensorNodesRef.limitToLast(400).on('value', (measures) => {
            let sensorValues = measures.val()
            let data = [];
            let time = [];
            Object.keys(sensorValues).forEach(function (value) {
                data.push(sensorValues[value][index])
                let t = value.toString().split("-")
                let d = t[2] + "/" + t[1] + "-" + t[3]
                time.push(d)
            });

            line.x = time;
            line.y = data;
            if (line.y.length >= 400) {
                line.x.shift();
                line.y.shift();
            }
            this.setState({revision: this.state.revision + 1});
            layout.datarevision = this.state.revision + 1;
        });
    };

    componentDidMount() {
        this.graphUpdateInterval = setInterval(this.getLiveData(this.props.node, this.props.index), 10000)
        console.log(this.graphUpdateInterval)
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.node !== this.props.node || nextProps.index !== this.props.index) {
            console.log(this.graphUpdateInterval)
            clearInterval(this.graphUpdateInterval);
            this.graphUpdateInterval = setInterval(setTimeout(() => {
                this.getLiveData(nextProps.node, nextProps.index)
            }, 500), 10000);
            console.log(this.graphUpdateInterval)
            console.log(nextProps.node, nextProps.index)
        }
    }

    render() {
        return (<div>
            <div  style={{marginLeft: 8, color: "#808080"}}>
                <h4>
                    {indexLabel[this.props.index]}
                </h4>
            </div>
            <Plot
                data={[
                    this.state.line,
                ]}
                layout={this.state.layout}
                revision={this.state.revision}
                graphDiv="graph"
            />
        </div>);
    }
}