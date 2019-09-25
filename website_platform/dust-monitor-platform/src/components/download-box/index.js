import React from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {withStyles} from "@material-ui/core";
import SaveIcon from '@material-ui/icons/CloudDownload';
import firebase from "../../firebase";

const style = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },

    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
});

const nodes = [
    {
        value: 'No_1',
        label: "Node 1",
    },
    {
        value: 'No_2',
        label: "Node 2",
    },
];

const nodeLabel = {
    'No_1': "Node 1",
    'No_2': "Node 2",
}

class DownloadBox extends React.Component {
    state = {
        number: '',
        node: '',
        successDownload: true,
    };

    changeNumber = event => {
        this.setState({number: event.target.value})
    }

    changeNode = event => {
        this.setState({node: event.target.value})
    }

    getData = event => {
        let node = this.state.node;
        let number_of_samples = 480 * this.state.number;

        let sensorValues = {}

        if (node !== "" && number_of_samples > 0) {
            const sensorNodesRef = firebase.database().ref(node);
            sensorNodesRef.limitToLast(number_of_samples).on('value', (measures) => {
                sensorValues = measures.val()
            });
            setTimeout(() => {
                DownloadBox.exportToJson(sensorValues, node)
            }, 2000)
            this.setState({successDownload: true})
        } else {
            this.setState({successDownload: false})
            console.log("Error")
        }
    };

    static exportToJson(objectData, NODE) {
        let filename = nodeLabel[NODE] + ".json";
        let contentType = "application/json;charset=utf-8;";
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(objectData)))], {type: contentType});
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            var a = document.createElement('a');
            a.download = filename;
            a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(objectData));
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    render() {
        const {classes} = this.props;

        return (
            <div style={{border: "thin solid gray", borderRadius: 7, marginLeft: 8, marginTop: 20, width: '100%'}}>
                <div style={{margin: 10}}>
                    <h5>DOWNLOAD NODE DATABASE</h5>
                </div>
                <TextField
                    id="standard-select-node"
                    select
                    label="Select Node"
                    className={classes.textField}
                    value={this.state.node}
                    onChange={this.changeNode}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    margin="normal"
                    variant="outlined"
                >
                    {nodes.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id="standard-number"
                    label="Number of day(s)"
                    value={this.state.number}
                    onChange={this.changeNumber}
                    type="number"
                    InputProps={{ inputProps: { min: 1} }}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                />
                <Button variant="contained" color="primary" onClick={this.getData} className={classes.button} style={{marginTop: 24, marginLeft: 20}}>
                    <SaveIcon className={classes.middleIcon} />
                </Button>
                <div style={{ color: "red", fontWeight: 'bold', marginLeft: 8, marginBottom: 8, visibility: this.state.successDownload !== false? 'hidden': 'visible'}}>
                    Error downloading! Please input valid number of day(s)!
                </div>
            </div>
        )
    }
}

export default withStyles(style)(DownloadBox)