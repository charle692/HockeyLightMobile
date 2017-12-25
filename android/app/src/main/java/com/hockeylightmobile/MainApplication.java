package com.hockeylightmobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.devstepbcn.wifi.AndroidWifiPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.tradle.react.UdpSocketsModule;
import com.pusherman.networkinfo.RNNetworkInfoPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new AndroidWifiPackage(),
          new RNNetworkInfoPackage(),
          new RNSpinkitPackage(),
          new UdpSocketsModule()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
