//---------------------------------
// sensor_node_AP
//---------------------------------

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>
#include <FirebaseArduino.h>
#include <FirebaseError.h>
#include <math.h>
#include <DHT.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

#define FIREBASE_HOST "host_name.firebaseio.com"
#define FIREBASE_AUTH "database_secret_key"

//--------------------------------
//Wi-Fi connection
int i = 0;
int statusCode;
const char* WIFI_SSID = "text";
const char* WIFI_PASSWORD = "text";
String st;
String content;

bool testWifi(void);
void launchWeb(void);
void setupAP(void);
//Establishing Local server at port 80 whenever required
ESP8266WebServer server(80);
//--------------------------------

// Define NTP Client to get time
#define NTP_time_zone 7 * 3600  //UTC+7
#define NTP_update 60 * 1000    //update interval [milliseconds]
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "asia.pool.ntp.org", NTP_time_zone, NTP_update);
//Time variables
String String_actualHour, String_actualMinute, String_actualSecond, String_actualDayOfWeek;
String dateStamp, timeStamp, String_actualTime;

#define LENG 31 //0x42 + 31 bytes equal to 32 bytes
unsigned char buf[LENG];
int PM01Value = 0;  // define PM1.0 value of the air detector module
int PM2_5Value = 0; // define PM2.5 value of the air detector module
int PM10Value = 0;  // define PM10  value of the air detector module

#define DHTPIN  14    // what digital pin we're connected to
#define DHTTYPE DHT22 // DHT 22  (AM2302), AM2321
DHT dht(DHTPIN, DHTTYPE);
float h, t, f, hif, hic;  // DHT's variables

const long interval = 60 * 1000; //Frequency getting data [millisecond]
unsigned long previousMillis = 0;

//Sensor_Value_Average
const int numRead = 3; //calculate mean value after read sensor 3 times
int indexRead = 0;
//PM_Value_Average
int PM01Value_Array[numRead], PM2_5Value_Array[numRead], PM10Value_Array[numRead];
int PM01Value_Total = 0, PM2_5Value_Total = 0, PM10Value_Total = 0;
int PM01Value_Average = 0, PM2_5Value_Average = 0, PM10Value_Average = 0;
//DHT_Value_Average
float t_Array[numRead], h_Array[numRead];
float t_Total = 0, h_Total = 0;
float t_Average = 0, h_Average = 0;

void setup()
{
  Serial.begin(9600);
  Serial.setTimeout(1500);
  delay(100);

  dht.begin();
  wifi_setup();
  timeClient.begin();
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  delay(100);

  for(int i = 0; i < numRead; i++){
    PM01Value_Array[i] = 0;
    PM2_5Value_Array[i] = 0;
    PM10Value_Array[i] = 0;
    t_Array[i] = 0;
    h_Array[i] = 0;
  }
}

void loop()
{
  int teller = 0;
  if(WiFi.status() != WL_CONNECTED)
  {
    delay(1000);  //Wait for the Wi-Fi to connect
    Serial.print(++teller);
    Serial.print(' ');
    if(teller == 30){
      ESP.restart();
    }
  }
  
  timeClient.update();
  
  unsigned long currentMillis = millis();

  if ((currentMillis - previousMillis) >= interval)
  {
    previousMillis = currentMillis;
    readTime();
    readDHT(); // Read data from H%, Temp Sensor
    readDustSensor(); // Read data from Dust Sensor
    Serial.flush();
    delay(100);
    
    Serial.println("");
    Serial.println(String_actualTime);
    Serial.println("-----------");
    Serial.println("PM 1.0 (ug/m3) = " + String(PM01Value));
    Serial.println("PM 2.5 (ug/m3) = " + String(PM2_5Value));
    Serial.println("PM 10 (ug/m3) = " + String(PM10Value));
    Serial.println("-----------");
    Serial.print("Temperature = ");
    Serial.print(t);
    Serial.println("°C");
    Serial.print("Humidity = ");
    Serial.print(h);
    Serial.println("%");
    Serial.println("-----------");
    
    sensorMeanValue();
  }
}

//----------------------------------------------
void readTime()
{
  String actualDayOfWeek[7] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

  //Date
  String formattedDate = timeClient.getFormattedDate();
  int splitT = formattedDate.indexOf("T");
  dateStamp = formattedDate.substring(0, splitT); //YYYY-MM-DD
  timeStamp = timeClient.getFormattedTime();
  
  //DayOfWeek
  String_actualDayOfWeek = actualDayOfWeek[timeClient.getDay()];
  
  //Hour
  if(timeClient.getHours() < 10){
    String_actualHour = "0" + String(timeClient.getHours());
  }else{
    String_actualHour = String(timeClient.getHours());
  }
  //Minute
  if(timeClient.getMinutes() < 10){
    String_actualMinute = "0" + String(timeClient.getMinutes());
  }else{
    String_actualMinute = String(timeClient.getMinutes());
  }
  //Second
  if(timeClient.getSeconds() < 10){
    String_actualSecond = "0" + String(timeClient.getSeconds());
  }else{
    String_actualSecond = String(timeClient.getSeconds());
  }
  //Date_Time
  String_actualTime = String_actualDayOfWeek + " " + dateStamp + " " + timeStamp;
}

//----------------------------------------------
void sensorMeanValue(){
  PM01Value_Total = PM01Value_Total - PM01Value_Array[indexRead];
  PM2_5Value_Total = PM2_5Value_Total - PM2_5Value_Array[indexRead];
  PM10Value_Total = PM10Value_Total - PM10Value_Array[indexRead];
  t_Total = t_Total - t_Array[indexRead];
  h_Total = h_Total - h_Array[indexRead];

  PM01Value_Array[indexRead] = PM01Value;
  PM2_5Value_Array[indexRead] = PM2_5Value;
  PM10Value_Array[indexRead] = PM10Value;
  t_Array[indexRead] = t;
  h_Array[indexRead] = h;

  PM01Value_Total = PM01Value_Total + PM01Value_Array[indexRead];
  PM2_5Value_Total = PM2_5Value_Total + PM2_5Value_Array[indexRead];
  PM10Value_Total = PM10Value_Total + PM10Value_Array[indexRead];
  t_Total = t_Total + t_Array[indexRead];
  h_Total = h_Total + h_Array[indexRead];

  indexRead++;

  if(indexRead >= numRead){
    indexRead = 0;
    PM01Value_Average = PM01Value_Total / numRead;
    PM2_5Value_Average = PM2_5Value_Total / numRead;
    PM10Value_Average = PM10Value_Total / numRead;
    t_Average = roundf(t_Total / numRead);
    h_Average = roundf(h_Total / numRead);

    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& data = jsonBuffer.createObject();
    data["PM_1_0"] = PM01Value_Average;
    data["PM_2_5"] = PM2_5Value_Average;
    data["PM_10"] = PM10Value_Average;
    data["Temp"] = t_Average;
    data["Humid"] = h_Average;

    Firebase.set("/node_name/" + dateStamp + "-" + String_actualHour + ":" + String_actualMinute + "/", data);
    if(Firebase.failed())
    {
      Serial.print("Pushing data failed");
      Serial.println(Firebase.error());
      Serial.println("Reconnecting to Firebase");
      Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
      Serial.println("Re-sending data to Firebase");
      Firebase.set("/node_name/" + dateStamp + "-" + String_actualHour + ":" + String_actualMinute + "/", data);
    }

    Serial.println("");
    Serial.println(String_actualTime);
    Serial.println("-----------");
    Serial.println("AVERAGE PM 1.0 (ug/m3) = " + String(PM01Value_Average));
    Serial.println("AVERAGE PM 2.5 (ug/m3) = " + String(PM2_5Value_Average));
    Serial.println("AVERAGE PM 10 (ug/m3) = " + String(PM10Value_Average));
    Serial.println("-----------");
    Serial.print("AVERAGE Temperature = ");
    Serial.print(t_Average);
    Serial.println("°C");
    Serial.print("AVERAGE Humidity = ");
    Serial.print(h_Average);
    Serial.println("%");
    Serial.println("-----------");
  }
}

//----------------------------------------------
void readDHT()
{
  h = dht.readHumidity();     
  t = dht.readTemperature();      // Read temperature as Celsius (the default)
  f = dht.readTemperature(true);  // Read temperature as Fahrenheit (isFahrenheit = true)
  
  if (isnan(h) || isnan(t) || isnan(f))
  {
    Serial.println("Failed to read from DHT sensor!");
    // return;
    // break;
  }
  
  hif = dht.computeHeatIndex(f, h);
  // Compute heat index in Celsius (isFahreheit = false)
  hic = dht.computeHeatIndex(t, h, false);
}

//----------------------------------------------
void readDustSensor()
{
  while (!Serial.find(0x42))
  {
    
  }
  
  Serial.readBytes(buf, LENG);

  if (buf[0] == 0x4d)
  {
    if (checkValue(buf, LENG))
    {
      PM01Value = transmitPM01(buf);    //count PM1.0 value of the air detector module
      PM2_5Value = transmitPM2_5(buf);  //count PM2.5 value of the air detector module
      PM10Value = transmitPM10(buf);    //count PM10 value of the air detector module
    }
  }
}

char checkValue(unsigned char *thebuf, char leng)
{
  char receiveflag = 0;
  int receiveSum = 0;
  
  for (int i = 0; i < (leng - 2); i++)
  {
    receiveSum = receiveSum + thebuf[i];
  }
  
  receiveSum = receiveSum + 0x42;

  if (receiveSum == ((thebuf[leng - 2] << 8) + thebuf[leng - 1])) //check the pmSerial data
  {
    receiveSum = 0;
    receiveflag = 1;
  }
  
  return receiveflag;
}

//transmit PM Value to PC
int transmitPM01(unsigned char *thebuf)
{
  int PM01Val;
  PM01Val = ((thebuf[3] << 8) + thebuf[4]); //count PM1.0 value of the air detector module
  return PM01Val;
}

int transmitPM2_5(unsigned char *thebuf)
{
  int PM2_5Val;
  PM2_5Val = ((thebuf[5] << 8) + thebuf[6]); //count PM2.5 value of the air detector module
  return PM2_5Val;
}

int transmitPM10(unsigned char *thebuf)
{
  int PM10Val;
  PM10Val = ((thebuf[7] << 8) + thebuf[8]); //count PM10 value of the air detector module
  return PM10Val;
}

//----------------------------------------------
void wifi_setup(){
  Serial.println("Disconnecting previously connected WiFi");
  WiFi.disconnect();
  EEPROM.begin(512); //Initialasing EEPROM
  Serial.println("Starting");
  
  Serial.println("Reading Wi-Fi SSID");
  String esid;
  for (int i = 0; i < 32; ++i)
  {
    esid += char(EEPROM.read(i));
  }
  Serial.println();
  Serial.print("Wi-Fi SSID: ");
  Serial.println(esid);
  Serial.println("Reading Wi-Fi password");

  String epass = "";
  for (int i = 32; i < 96; ++i)
  {
    epass += char(EEPROM.read(i));
  }
  Serial.print("Wi-Fi password: ");
  Serial.println(epass);

  WiFi.begin(esid.c_str(), epass.c_str());
  if (testWifi())
  {
    Serial.println("Succesfully Connected!");
    return;
  }
  else
  {
    Serial.println("Turn on the hotspot connection.");
    launchWeb();
    setupAP();// Setup HotSpot
  }

  Serial.println();
  Serial.println("Waiting...");
  
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(100);
    server.handleClient();
  }
}

//----------------------------------------------
//Setup ESP access point
bool testWifi(void)
{
  int c = 0;
  Serial.println("Connecting Wi-Fi...");
  while ( c < 20 ) {
    if (WiFi.status() == WL_CONNECTED)
    {
      return true;
    }
    delay(500);
    Serial.print("*");
    c++;
  }
  Serial.println("");
  Serial.println("Connect timeout, booting access point.");
  return false;
}

void launchWeb()
{
  Serial.println("");
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("Wi-Fi connected");
  }
  Serial.print("Local IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("Access point IP: ");
  Serial.println(WiFi.softAPIP());
  //Start the server
  createWebServer();
  server.begin();
  Serial.println("Server started");
}

void setupAP(void)
{
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  int n = WiFi.scanNetworks();
  Serial.println("Scanning Wi-Fi networks...");
  if (n == 0)
    Serial.println("No networks found!");
  else
  {
    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i)
    {
      // Print SSID and RSSI for each network found
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.print(")");
      Serial.println((WiFi.encryptionType(i) == ENC_TYPE_NONE) ? " " : "*");
      delay(10);
    }
  }
  Serial.println("");
  st = "<ol>";
  for (int i = 0; i < n; ++i)
  {
    // Print SSID and RSSI for each network found
    st += "<li>";
    st += WiFi.SSID(i);
    st += " (";
    st += WiFi.RSSI(i);

    st += ")";
    st += (WiFi.encryptionType(i) == ENC_TYPE_NONE) ? " " : "*";
    st += "</li>";
  }
  st += "</ol>";
  delay(100);
  WiFi.softAP("Sensor_node_AP", "");
  Serial.println("Access Point");
  launchWeb();
}

void createWebServer()
{
 {
    server.on("/", []() {

      IPAddress ip = WiFi.softAPIP();
      String ipStr = String(ip[0]) + '.' + String(ip[1]) + '.' + String(ip[2]) + '.' + String(ip[3]);
      content = "<!DOCTYPE HTML>\r\n<html>Hello from ESP8266 at ";
      content += "<form action=\"/scan\" method=\"POST\"><input type=\"submit\" value=\"scan\"></form>";
      content += ipStr;
      content += "<p>";
      content += st;
      content += "</p><form method='get' action='setting'><label>SSID: </label><input name='WIFI_SSID' length=32><input name='WIFI_PASSWORD' length=64><input type='submit'></form>";
      content += "</html>";
      server.send(200, "text/html", content);
    });
    server.on("/scan", []() {
      //setupAP();
      IPAddress ip = WiFi.softAPIP();
      String ipStr = String(ip[0]) + '.' + String(ip[1]) + '.' + String(ip[2]) + '.' + String(ip[3]);

      content = "<!DOCTYPE HTML>\r\n<html>go back";
      server.send(200, "text/html", content);
    });

    server.on("/setting", []() {
      String qsid = server.arg("WIFI_SSID");
      String qpass = server.arg("WIFI_PASSWORD");
      if (qsid.length() > 0 && qpass.length() > 0) {
        Serial.println("clearing eeprom");
        for (int i = 0; i < 96; ++i) {
          EEPROM.write(i, 0);
        }
        Serial.println(qsid);
        Serial.println("");
        Serial.println(qpass);
        Serial.println("");

        Serial.println("writing eeprom ssid:");
        for (int i = 0; i < qsid.length(); ++i)
        {
          EEPROM.write(i, qsid[i]);
          Serial.print("Wrote: ");
          Serial.println(qsid[i]);
        }
        Serial.println("writing eeprom pass:");
        for (int i = 0; i < qpass.length(); ++i)
        {
          EEPROM.write(32 + i, qpass[i]);
          Serial.print("Wrote: ");
          Serial.println(qpass[i]);
        }
        EEPROM.commit();

        content = "{\"Success\":\"Saved to eeprom... reset to boot into new Wi-Fi\"}";
        statusCode = 200;
        ESP.reset();
      } else {
        content = "{\"Error\":\"404 not found\"}";
        statusCode = 404;
        Serial.println("Sending 404");
      }
      server.sendHeader("Access-Control-Allow-Origin", "*");
      server.send(statusCode, "application/json", content);

    });
  } 
}
