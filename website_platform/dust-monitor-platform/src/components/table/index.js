import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const style = theme => ({
    root: {
        width: '100%',
        margin: theme.spacing(1),
        overflowX: 'auto',
    },
    table: {
        minWidth: '30vh',
    },
});

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

class SensorDataTable extends React.Component {
    render() {
        const {classes} = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Index</StyledTableCell>
                            <StyledTableCell align="right">Value</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.sensorData.map((row) => (
                            <StyledTableRow key={row.key}>
                                <StyledTableCell component="th" scope="row">{row.key}</StyledTableCell>
                                <StyledTableCell align="right">{row.value}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                <div style={{padding: '10px'}}><i>Last update: {this.props.lastUpdateTime}</i></div>
            </Paper>
        );
    }
}

export default withStyles(style)(SensorDataTable)