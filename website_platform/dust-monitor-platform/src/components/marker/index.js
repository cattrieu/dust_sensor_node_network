import React from 'react';
import PropTypes from 'prop-types'
import shouldPureComponentUpdate from 'react-pure-render/function';

import firebase from "../../firebase";
import marker1 from "../../assets/marker/m1.png";
import marker2 from "../../assets/marker/m2.png";
import marker3 from "../../assets/marker/m3.png";
import marker4 from "../../assets/marker/m4.png";
import marker5 from "../../assets/marker/m5.png";

export default class Marker extends React.Component {
    static propTypes = {
        text: PropTypes.string
    };

    state = {
        PM_2_5: 0,
    }

    static defaultProps = {};

    getPMValue = (node) => {
        const sensorNodesRef = firebase.database().ref(node);

        sensorNodesRef.limitToLast(1).on('value', (measures) => {
            let sensorValues = measures.val()
            let PMValue = 0
            Object.keys(sensorValues).forEach(function (value) {
                PMValue = sensorValues[value].PM_2_5
            })
            setTimeout(this.setState({PM_2_5: PMValue}), 500)
        })
    }

    componentDidUpdate() {
        this.getPMValue(this.props.value)
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        let K_WIDTH = 54;
        let K_HEIGHT = 54;

        let markerStyle = {
            position: 'absolute',
            width: K_WIDTH,
            height: K_HEIGHT,
            left: -K_WIDTH / 2,
            top: -K_HEIGHT / 2,


            lineHeight: 2.5,
            textAlign: 'center',
            verticalAlign: 'middle',
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 'bold',
            padding: 6,
            paddingTop: 7.5,
            paddingRight: 7,
        };

        if (this.state.PM_2_5 > 150) {
            markerStyle.backgroundImage = `url(${marker5})`;
        } else if (this.state.PM_2_5 > 100) {
            markerStyle.backgroundImage = `url(${marker4})`;
        } else if (this.state.PM_2_5 > 55) {
            markerStyle.backgroundImage = `url(${marker3})`;
        } else if (this.state.PM_2_5 > 30) {
            markerStyle.backgroundImage = `url(${marker2})`;
        } else if (this.state.PM_2_5 > 0) {
            markerStyle.backgroundImage = `url(${marker1})`;
        }

        return (
            <div>
                <div style={markerStyle} onClick={e => this.props.onClick(this.props.value)}>
                    {this.state.PM_2_5}
                </div>
            </div>
        );
    }
}