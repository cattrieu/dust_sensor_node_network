import React from 'react'
import Graph from '../live-graph';
import {withStyles} from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const style = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
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

const indexes = [
    {
        value: 'Temp',
        label: "Temperature",
    },
    {
        value: 'Humid',
        label: "Humidity",
    },
    {
        value: 'PM_1_0',
        label: "PM 1.0",
    },
    {
        value: 'PM_2_5',
        label: "PM 2.5",
    },
    {
        value: 'PM_10',
        label: "PM 10",
    },
];


class GraphPage extends React.Component {
    state = {
        node: 'No_1',
        index: 'Temp',
    };

    changeNode = event => {
        this.setState({node: event.target.value})
    }

    changeIndex = event => {
        this.setState({index: event.target.value})
    }

    selectIndex = event => {
        this.setState({index: event.target.value})
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <div style={{marginLeft: '45%', color: "#000000"}}>
                    <h4>
                        LAST 24H DATA
                    </h4>
                </div>
                <div>
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

                    <div style={{margin : 8}}>
                        <ButtonGroup aria-label="Basic example">
                            {indexes.map(option => (
                                <Button variant="primary" onClick={this.selectIndex}
                                        value={option.value}>{option.label}</Button>
                            ))}
                        </ButtonGroup>
                    </div>
                </div>
                <div>
                    <Graph node={this.state.node} index={this.state.index}/>
                </div>
            </div>
        )
    }
}

export default withStyles(style)(GraphPage)