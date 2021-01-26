package com.facebook.react.uimanager;

import android.app.Activity;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.views.modal.ReactModalHostManager;
import com.facebook.react.views.modal.ReactModalHostView;
import com.facebook.react.views.textinput.ReactEditText;
import com.facebook.react.views.textinput.BlurEvent;
import com.facebook.react.views.textinput.EndEditingEvent;
import com.facebook.react.views.textinput.FocusEvent;
import com.facebook.react.views.textinput.ReactTextInputManager;
import com.facebook.react.views.textinput.SubmitEvent;
import com.facebook.react.views.view.ReactViewGroup;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

//public class KeyboardKitModule extends ReactTextInputManager {
/**
 *  This class is an custom `Keyboard` module shall handle issue flickering
 * when applying `TextInput.onChangeText` in React Native library.
 * Source:
 * + {@link <a href='https://github.com/facebook/react-native/issues/24585'}>Issue flickering link 1</a>}.
 * + {@link <a href='https://github.com/facebook/react-native/issues/28223'}>Issue flickering link 2</a>}.
 *
 * React Native library itself has {@link <a
 * href='https://reactnative.dev/docs/textinput#maxlength'}>`TextInput.props.maxLength`</a>}
 * which handle this issue.
 * Thanks to QC supported, I found out that `maxLength` does not work with Android API 29 and
 * shall create new issue that make `TextInput` does not trigger `onKeyPress` (some devices shall
 * send event `backspace` if `maxLength` === `text.length`).
 * Source:
 * + {@link <a href='https://github.com/facebook/react-native/blob/933cef6d9a6cf10231e5960a0f0cd3a8ebd11a3c/ReactAndroid/src/main/java/com/facebook/react/views/textinput/ReactEditText.java#L437'}>React Native library confirmation</a>}.
 * + {@link <a href='https://github.com/facebook/react-native/issues/18339'}>Issue `onKeyPress` not trigger</a>}.
 *
 * Note: The `setTag` shall required `Android Version` higher than 4.0
 * Source:
 * + {@link <a href='https://stackoverflow.com/questions/5291726/what-is-the-main-purpose-of-settag-gettag-methods-of-view'}>`setTag` shall make memory leak</a>}.
 * */
public class CustomKeyboardKitV2Module extends ReactContextBaseJavaModule {

  public static final String MODULE_NAME = "NativeKeyboardKit";

  public static final String EVENT_KEYBOARD_SHOW = "KeyboardShow";
  public static final String EVENT_KEYBOARD_HIDE = "KeyboardHide";

  public static final int currentScale = 216;

  private final int TAG_ID = 0xdeadbeaf;

  ReactRootView rootView = null;

  private static EventDispatcher getEventDispatcher(
    ReactContext reactContext, ReactEditText editText) {
    return UIManagerHelper.getEventDispatcherForReactTag(reactContext, editText.getId());
  }

  public CustomKeyboardKitV2Module (ReactApplicationContext context) {
    super(context);
  }


  @NonNull
  @Override
  public String getName() { return CustomKeyboardKitV2Module.MODULE_NAME; }

  /**
   * @descirption Get current CustomTextInput
   **/
  private ReactEditText getEditById(int id) {
    UIViewOperationQueue uii = null;
    ReactEditText editText = null;
    while(editText == null) {
      uii = this.getReactApplicationContext()
        .getNativeModule( UIManagerModule.class )
        .getUIImplementation()
        .getUIViewOperationQueue();

      try {
        editText = (ReactEditText) uii
          .getNativeViewHierarchyManager()
          .resolveView(id);
      } catch (IllegalViewOperationException e) {
        // temporarily doing nothing if
        // current React component is not CustomTextInput
      }
    }

    return editText;
  }

  private View  getViewById(int id) {
    UIViewOperationQueue uii = null;
    View editText = null;
    while(editText == null) {
      uii = this.getReactApplicationContext()
        .getNativeModule( UIManagerModule.class )
        .getUIImplementation()
        .getUIViewOperationQueue();

      try {
        editText = (View) uii
          .getNativeViewHierarchyManager()
          .resolveView(id);
      } catch (IllegalViewOperationException e) {
        // temporarily doing nothing if
        // current React componennt is not CustomTextInput
      }
    }

    return editText;
  }

  /**
   * @descirption Get current CustomTextInput
   **/
  private ReactTextInputManager getTextInputManager(int id) {
    UIViewOperationQueue uii = null;
    ReactTextInputManager textInputManager = null;

    while(textInputManager == null) {
      uii = this.getReactApplicationContext()
        .getNativeModule( UIManagerModule.class )
        .getUIImplementation()
        .getUIViewOperationQueue();

      try {
        textInputManager = (ReactTextInputManager) uii
          .getNativeViewHierarchyManager()
          .resolveViewManager(id);
      } catch (IllegalViewOperationException e) {
        // temporarily doing nothing if
        // current React componennt is not CustomTextInput
      }
    }
    return textInputManager;
  }

  private ReactModalHostView getModalHostView(int id) {
    UIViewOperationQueue uii = null;
    ReactModalHostView modalHostView = null;

    while(modalHostView == null) {
      uii = this.getReactApplicationContext()
        .getNativeModule( UIManagerModule.class )
        .getUIImplementation()
        .getUIViewOperationQueue();

      try {
        modalHostView = (ReactModalHostView) uii
          .getNativeViewHierarchyManager()
          .resolveView(id);
      } catch (IllegalViewOperationException e) {
        // temporarily doing nothing if
        // current React componennt is not CustomTextInput
      }
    }
    return modalHostView;
  }

  private View createCustomKeyboardKit(
    Activity activity,
    int keyboardType,
    String type
  ) {
    RelativeLayout layout = new RelativeLayout(activity);
    this.rootView = new ReactRootView(this.getReactApplicationContext());
    this.rootView.setBackgroundColor(Color.WHITE);

    Bundle bundle = new Bundle();
    bundle.putInt("tag", keyboardType);
    bundle.putString("type", type);

    this.rootView.startReactApplication(
      ((ReactApplication) activity.getApplication())
        .getReactNativeHost()
        .getReactInstanceManager(),
      CustomKeyboardKitV2Module.MODULE_NAME,
      bundle
    );

    final float scale = activity.getResources().getDisplayMetrics().density;
    RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT,
      Math.round(CustomKeyboardKitV2Module.currentScale * scale)
    );
    layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM, RelativeLayout.TRUE);

    layout.addView(rootView, layoutParams);

    return layout;
  }

  private void sendEvent(ReactContext reactContext,
                         String eventName,
                         @Nullable WritableMap params) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  @RequiresApi(Build.VERSION_CODES.DONUT)
  @ReactMethod
  public void install(
    final int tag,
    final String type,
    final int tagModal,
    final int tagView,
    Callback callback
  ) {
    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        final Activity activity = getCurrentActivity();
        final ReactEditText editText = getEditById(tag);
        final ReactTextInputManager manager = getTextInputManager(tag);

        if (editText == null) { return; }

        manager.showKeyboardOnFocus(editText,false);
        editText.setTag(
          TAG_ID,
          createCustomKeyboardKit(activity, tag, type)
        );

        /**
         * Note: Currently, it is not able to handle props.onFocus
         * */
        editText.setOnFocusChangeListener(new View.OnFocusChangeListener(){
          @Override
          public void onFocusChange(View currentView, boolean didFocused) {
            View keyboard = (View) editText.getTag(TAG_ID);

            /**
             * Get current ReactContext
             * */
            ReactContext context = UIManagerHelper.getReactContext(editText);
            EventDispatcher eventDispatcher = getEventDispatcher(context, editText);

            if (didFocused) {
              if (tagModal > 0 && tagView > 0) {
                if (keyboard.getParent() != null) {
                  ((ViewGroup) keyboard.getParent()).removeView(keyboard);
                }

                // New `View`
                ReactViewGroup view = (ReactViewGroup)getViewById(tagView);
                view.addView(keyboard,0);

                // `Modal` add new `View` to render
                ReactModalHostView modalHostView = getModalHostView(tagModal);
                modalHostView.onHostResume();

              } else if (keyboard.getParent() == null) {
                activity.addContentView(keyboard, new ViewGroup.LayoutParams(
                  ViewGroup.LayoutParams.MATCH_PARENT,
                  ViewGroup.LayoutParams.MATCH_PARENT
                ));
              }
              eventDispatcher.dispatchEvent(new FocusEvent(editText.getId()));
              sendEvent(
                context,
                CustomKeyboardKitV2Module.EVENT_KEYBOARD_SHOW,
                null
              );
              /**
               * Note: Having hide keyboard
               * */
//                            UiThreadUtil.runOnUiThread(new Runnable() {
//                                @Override
//                                public void run() {
              ((InputMethodManager) getReactApplicationContext()
                .getSystemService(
                  Activity.INPUT_METHOD_SERVICE
                )
              ).hideSoftInputFromWindow(
                currentView.getWindowToken(),
                0
              );


//                                }
//                            });
            } else {
              if(keyboard.getParent() != null) {
                ((ViewGroup) keyboard.getParent()).removeView(keyboard);
              }
              eventDispatcher.dispatchEvent(new BlurEvent(editText.getId()));

              eventDispatcher.dispatchEvent(
                new EndEditingEvent(
                  editText.getId(), editText.getText().toString()));

              sendEvent(
                context,
                CustomKeyboardKitV2Module.EVENT_KEYBOARD_HIDE,
                null
              );
            }
          }
        });

        editText.setOnClickListener(new View.OnClickListener() {
          @Override
          public void onClick(View currentView) {
            View keyboard = (View) editText.getTag(TAG_ID);
            if (keyboard.getParent() == null) {
              activity.addContentView(
                keyboard,
                new ViewGroup.LayoutParams(
                  ViewGroup.LayoutParams.MATCH_PARENT,
                  ViewGroup.LayoutParams.MATCH_PARENT
                )
              );
            }


            /**
             * Note: Having hide keyboard
             * */
            UiThreadUtil.runOnUiThread(new Runnable() {
              @Override
              public void run() {
                ((InputMethodManager) getReactApplicationContext()
                  .getSystemService(
                    Activity.INPUT_METHOD_SERVICE
                  )
                ).hideSoftInputFromWindow(
                  currentView.getWindowToken(),
                  0
                );
              }
            });
          }
        });
      }

    });
  }

  @RequiresApi(Build.VERSION_CODES.DONUT)
  @ReactMethod
  public void uninstall(final int tag) {
    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        final ReactEditText editText = getEditById(tag);
        if (editText == null) { return; }

        editText.setTag(TAG_ID, null);
      }
    });
  }

  @RequiresApi(Build.VERSION_CODES.DONUT)
  @ReactMethod
  public void insertText(final int tag, final String text) {
    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        final ReactEditText editText = getEditById(tag);
        if (editText == null) { return; }

        int start = Math.max(editText.getSelectionStart(),0);
        int end = Math.max(editText.getSelectionEnd(),0);

        editText.getText().replace(
          Math.min(start, end),
          Math.max(start, end),
          text,
          0,
          text.length()
        );
      }
    });
  }

  @RequiresApi(Build.VERSION_CODES.DONUT)
  @ReactMethod
  public void submit(final int tag) {
    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        final ReactEditText editText = getEditById(tag);

        if (editText == null) { return; }

        ReactContext context = UIManagerHelper.getReactContext(editText);
        EventDispatcher eventDispatcher = getEventDispatcher(context, editText);
        eventDispatcher.dispatchEvent(
          new SubmitEvent(
            editText.getId(), editText.getText().toString()));

      }
    });
  }

  @RequiresApi(Build.VERSION_CODES.DONUT)
  @ReactMethod
  public void backSpace(final int tag) {
    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        final ReactEditText editText = getEditById(tag);

        if (editText == null) { return; }

        int start = Math.max(editText.getSelectionStart(), 0);
        int  end = Math.max(editText.getSelectionEnd(), 0);

        if (start != end) { editText.getText().delete(start,end); }
        else if (start > 0) { editText.getText().delete(start - 1, end); }
      }
    });
  }

  @RequiresApi(Build.VERSION_CODES.DONUT)
  @ReactMethod
  public void hideKeyboard(final int tag) {
    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        final ReactEditText editText = getEditById(tag);
        if (editText == null) { return; }

        View keyboard = (View) editText.getTag(TAG_ID);
        if (keyboard.getParent() != null) {
          ((ViewGroup) keyboard.getParent()).removeView(keyboard);
        }
      }
    });
  }
}
