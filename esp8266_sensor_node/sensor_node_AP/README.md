## `sensor_node_AP.ino`
The sensor node will be run as the access point mode to modify the Wi-Fi connection.

## Modify sketch

#### Wi-Fi setup

After powering the sensor node, use a laptop or a mobile phone connect to the hotspot `Sensor_node_AP`.
Open the web-browser and go to `192.168.4.1`, enter the Wi-Fi SSID and Wi-Fi password.

#### Firebase setup
Replace the Firebase host name and secret key

```ruby
#define FIREBASE_HOST "host_name.firebaseio.com"
#define FIREBASE_AUTH "database_secret_key"
```

#### Change the sensor node name
Replace the sensor node name

```ruby
void sensorMeanValue(){
	Firebase.set("/node_name/" + dateStamp + "-" + String_actualHour + ":" + String_actualMinute + "/", data);
}
```