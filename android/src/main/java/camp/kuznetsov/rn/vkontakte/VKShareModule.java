package camp.kuznetsov.rn.vkontakte;


import android.app.Activity;
import android.app.DialogFragment;
import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import com.facebook.react.bridge.*;
import android.util.Log;

import com.facebook.common.executors.UiThreadImmediateExecutorService;
import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.react.views.imagehelper.ImageSource;

import com.vk.sdk.*;
import com.vk.sdk.api.VKError;
import com.vk.sdk.dialogs.VKShareDialog;
import com.vk.sdk.dialogs.VKShareDialogBuilder;
import com.vk.sdk.api.photo.VKUploadImage;
import com.vk.sdk.api.photo.VKImageParameters;

import javax.annotation.Nullable;

public class VKShareModule extends ReactContextBaseJavaModule {
    private static final String LOG = "VKAuthModule";

    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
    private static final String E_VKSDK_ERROR = "E_VKSDK_ERROR";
    private static final String E_NOT_LOGGED_IN = "E_NOT_LOGGED_IN";

    private Bitmap shareImage = null;

    public VKShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "VkontakteSharing";
    }

    @ReactMethod
    public void share(final ReadableMap data, final Promise promise) {
        Log.d(LOG, "Open Share Dialog");
        final Activity activity = getCurrentActivity();

        if (activity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        if (!VKSdk.isLoggedIn()) {
            promise.reject(E_NOT_LOGGED_IN, "Must be logged in to share something");
            return;
        }


        DialogFragment fragment = (DialogFragment) activity
                .getFragmentManager().findFragmentByTag("VK_SHARE_DIALOG");
        if (fragment != null) {
            fragment.dismiss();
        }

        final VKShareDialogBuilder builder = new VKShareDialogBuilder()
                .setText(data.getString("description"))
                .setAttachmentLink(data.getString("linkText"), data.getString("linkUrl"))
                .setShareDialogListener(new VKShareDialog.VKShareDialogListener() {
                    @Override
                    public void onVkShareComplete(int postId) {
                        Log.d(LOG, "onVkShareComplete");

                        recycleShareImage();

                        promise.resolve(postId);
                    }
                    @Override
                    public void onVkShareCancel() {
                        Log.d(LOG, "onVkShareCancel");

                        recycleShareImage();

                        promise.reject(E_VKSDK_ERROR, "canceled");
                    }
                    @Override
                    public void onVkShareError(VKError error) {
                        Log.d(LOG, "ERROR CODE:" + error.errorCode);
                        Log.d(LOG, "ERROR MESSAGE:" + error.errorMessage);
                        Log.d(LOG, "ERROR API MESSAGE:" + error.apiError.errorMessage);

                        DialogFragment fragment = (DialogFragment) activity
                                .getFragmentManager().findFragmentByTag("VK_SHARE_DIALOG");
                        if (fragment != null) {
                            fragment.dismiss();
                        }

                        recycleShareImage();

                        promise.reject(
                                "" + error.errorCode,
                                error.errorMessage + ". " + error.apiError.errorMessage
                        );
                    }
                });

        Uri uri = null;
        if (data.hasKey("image")) {
            try {
                uri = new ImageSource(getReactApplicationContext(), data.getString("image")).getUri();
            } catch (Exception e) {
                // ignore malformed uri, then attempt to extract resource ID.
            }
        }

        if (uri != null) {
            getImage(uri, new ImageCallback() {
                @Override
                public void invoke(@Nullable Bitmap bitmap) {
                    shareImage = bitmap;
                    builder
                            .setAttachmentImages(new VKUploadImage[]{
                                    new VKUploadImage(bitmap, VKImageParameters.pngImage())
                            })
                            .show(activity.getFragmentManager(), "VK_SHARE_DIALOG");
                }
            });
        } else {
            builder.show(activity.getFragmentManager(), "VK_SHARE_DIALOG");
        }
    }

    private void getImage(Uri uri, final ImageCallback imageCallback) {
        BaseBitmapDataSubscriber dataSubscriber = new BaseBitmapDataSubscriber() {
            @Override
            protected void onNewResultImpl(Bitmap bitmap) {
                bitmap = bitmap.copy(bitmap.getConfig(), true);
                imageCallback.invoke(bitmap);
            }

            @Override
            protected void onFailureImpl(DataSource<CloseableReference<CloseableImage>> dataSource) {
                imageCallback.invoke(null);
            }
        };

        ImageRequestBuilder builder = ImageRequestBuilder.newBuilderWithSource(uri);
        ImageRequest imageRequest = builder.build();

        ImagePipeline imagePipeline = Fresco.getImagePipeline();
        DataSource<CloseableReference<CloseableImage>> dataSource = imagePipeline.fetchDecodedImage(imageRequest, null);
        dataSource.subscribe(dataSubscriber, UiThreadImmediateExecutorService.getInstance());
    }

    private void recycleShareImage() {
        if (shareImage != null) {
            shareImage.recycle();
            shareImage = null;
        }
    }

    private interface ImageCallback {
        void invoke(@Nullable Bitmap bitmap);
    }
}
