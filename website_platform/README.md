# Getting Started
The following instructions will help you modify the project.

## Firebase setup
Go to Firebase console `Project settings` > `General` > `Config`

Replace the Firebase config in `src\Firebase.js`

```ruby
const config = {
    apiKey: "",
    authDomain: "host_name.firebaseapp.com",
    databaseURL: "https://host_name.firebaseio.com",
    projectId: "host_name",
    storageBucket: "host_name.appspot.com",
    messagingSenderId: "",
};
```

## Google Maps API
Follow the instructions on how to get [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/get-api-key)

Replace the Google Maps API in `src\components\map`

```ruby
class GoogleMap extends React.Component {
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "GOOGLE_MAPS_API" }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    options={MapOption}
                >
}
```

## Sensor nodes
Replace the name of sensor nodes in `src\components\`

#### download-box
```ruby
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
```

#### graph-page
```ruby
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

class GraphPage extends React.Component {
    state = {
        node: 'No_1',
        index: 'Temp',
    };
}
```

#### map
Change the coordinates corresponding to the sensor node locations
```ruby
const markers = [
    {
        lat: 11.0543891,
        lng: 106.6652194,
        text: "Node 1",
        value: "No_1",
    },
    {
        lat: 11.0545158,
        lng: 106.6655872,
        text: "Node 2",
        value: "No_2",
    },

]

class GoogleMap extends React.Component {
        center: {
            lat: 10.9212591,
            lng: 106.6747851
        },
}
```

#### monitor-page
```ruby
export default class MonitorPage extends React.Component {
    state = {
        node: 'No_1',
        sensorData: [],
        lastUpdateTime: ''
    }
}
```

#### right-panel
```ruby
class RightPanel extends React.Component {
                            <option value={'No_1'}>Node 1</option>
                            <option value={'No_2'}>Node 2</option>
}
```

#### tabs
```ruby
export default function FullWidthTabs() {
    const [value, setValue] = React.useState({
        id: 0,
        node: 'No_1',
        index: 'Temp',
    });
}
```