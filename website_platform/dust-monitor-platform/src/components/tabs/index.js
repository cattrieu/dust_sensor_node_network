import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import MonitorPage from "../monitor-page";
import GraphPage from "../graph-page";

function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
}));

export default function FullWidthTabs() {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState({
        id: 0,
        node: 'No_1',
        index: 'Temp',
    });

    function handleChange(event, newValue) {
        setValue({...value, id: newValue});
    }

    function handleChangeIdx(index) {
        setValue({...value, id: index});
    }

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value.id}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    centered
                >
                    <Tab label="Real-time data" />
                    <Tab label="Graph" />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value.id}
                onChangeIndex={handleChangeIdx}
            >
                <TabContainer dir={theme.direction}>
                    <MonitorPage/>
                </TabContainer>
                <TabContainer dir={theme.direction}>
                    <GraphPage/>
                </TabContainer>
            </SwipeableViews>
        </div>
    );
}