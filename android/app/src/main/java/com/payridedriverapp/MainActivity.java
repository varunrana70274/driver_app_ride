
package com.payridedrivers.app;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.rnfs.RNFSPackage;
public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
     SplashScreen.show(this);
    return "payRideDriverApp";
  }
  @Override
  public void onResume() {
    super.onResume();
    ReactContext reactContext = getReactInstanceManager().getCurrentReactContext();
    WritableMap params = Arguments.createMap();
    params.putString("event", "active");

    // when app starts reactContext will be null initially until bridge between Native and React Native is established
    if(reactContext != null) {
      getReactInstanceManager().getCurrentReactContext()
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
              .emit("ActivityStateChange", params);
    }
  }

  @Override
  public void onPause() {
    super.onPause();
    ReactContext reactContext = getReactInstanceManager().getCurrentReactContext();
    WritableMap params = Arguments.createMap();
    params.putString("event", "inactive");

    if(reactContext != null) {
      getReactInstanceManager().getCurrentReactContext()
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
              .emit("ActivityStateChange", params);
    }
  }

  @Override
  public void onStop() {
    super.onStop();
    ReactContext reactContext = getReactInstanceManager().getCurrentReactContext();
    WritableMap params = Arguments.createMap();
    params.putString("event", "background");

    if(reactContext != null) {
      getReactInstanceManager().getCurrentReactContext()
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
              .emit("ActivityStateChange", params);
    }
  }
}
