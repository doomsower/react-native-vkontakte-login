#import "RCTBridge.h"
#import "RCTConvert.h"
#import <RCTUtils.h>
#import "RCTImageLoader.h"
#import "RCTImageSource.h"

#import "VkontakteSharing.h"
#import "VKSdk.h"

#ifdef DEBUG
#define DMLog(...) NSLog(@"[VKLogin] %s %@", __PRETTY_FUNCTION__, [NSString stringWithFormat:__VA_ARGS__])
#else
#define DMLog(...) do { } while (0)
#endif

@implementation VkontakteSharing

@synthesize bridge = _bridge;

- (void)openShareDlg:(VKShareDialogController *) dialog resolver: (RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock) reject {
  UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
  [dialog setCompletionHandler:^(VKShareDialogController *dialog, VKShareDialogControllerResult result) {
    if (result == VKShareDialogControllerResultDone) {
      DMLog(@"onVkShareComplete");
      resolve(dialog.postId);
      // done
    } else if (result == VKShareDialogControllerResultCancelled) {
      DMLog(@"onVkShareCancel");
      reject(RCTErrorUnspecified, nil, RCTErrorWithMessage(@"canceled"));
    }
  }];

  [root presentViewController:dialog animated:YES completion:nil];
}

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(share: (NSDictionary *) data resolver: (RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock) reject) {
  DMLog(@"Open Share Dialog");
  VKShareDialogController * shareDialog = [VKShareDialogController new];
  shareDialog.text = [RCTConvert NSString:data[@"description"]];
  shareDialog.shareLink = [[VKShareLink alloc] initWithTitle:[RCTConvert NSString:data[@"linkText"]]
                                               link:[NSURL URLWithString:[RCTConvert NSString:data[@"linkUrl"]]]];
  shareDialog.dismissAutomatically = YES;

  NSString *imagePath = data[@"image"];
  if (imagePath.length && _bridge.imageLoader) {
    RCTImageSource *source = [RCTConvert RCTImageSource:data[@"image"]];

    [_bridge.imageLoader loadImageWithURLRequest:source.request callback:^(NSError *error, UIImage *image) {
      if (image == nil) {
        NSLog(@"Failed to load image");
      } else {
        VKUploadImage *VKImage = [[VKUploadImage alloc] init];
        VKImage.sourceImage = image;
        shareDialog.uploadImages = @[VKImage];
      }
      [self openShareDlg:shareDialog resolver:resolve rejecter:reject];
    }];
  } else {
    [self openShareDlg:shareDialog resolver:resolve rejecter:reject];
  }
}

@end
