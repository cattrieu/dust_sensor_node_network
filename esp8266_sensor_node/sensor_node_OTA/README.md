## `sensor_node_OTA.ino`
The sensor node will be run as the over-the-air mode to remotely upload a new sketch.

[Learn more](https://lastminuteengineers.com/esp8266-ota-updates-arduino-ide/)

## Modify sketch

#### Wi-Fi setup
Replace the Wi-Fi SSID and password

```ruby
#define WIFI_SSID "YOUR_WIFI"
#define WIFI_PASSWORD "YOUR_PASSWORD"
```

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