import React from 'react'
import {withStyles} from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import SensorDataTable from "../table";
import DownloadBox from "../download-box";

const style = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
});

class RightPanel extends React.Component {

    render() {
        const {classes} = this.props;
        return (
            <div>
                <div>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="node-native-simple">Select Node</InputLabel>
                        <Select
                            native
                            value={this.props.node}
                            onChange={this.props.onSelectNode}
                            inputProps={{
                                name: 'node',
                                id: 'node-native-simple',
                            }}
                        >
                            <option value={'No_1'}>Node 1</option>
                            <option value={'No_2'}>Node 2</option>
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <SensorDataTable node={this.props.node} sensorData={this.props.sensorData} lastUpdateTime={this.props.lastUpdateTime}/>
                </div>
                <div>
                    <DownloadBox/>
                </div>
            </div>
        )
    }
}

export default withStyles(style)(RightPanel)