#import "VkontakteManager.h"

#if __has_include(<VKSdkFramework/VKSdkFramework.h>)
#import <VKSdkFramework/VKSdkFramework.h>
#else
#import "VKSdk.h"
#endif

#if __has_include(<React/RCTUtils.h>)
#import <React/RCTUtils.h>
#elif __has_include("RCTUtils.h")
#import "RCTUtils.h"
#else
#import "React/RCTUtils.h" // Required when used as a Pod in a Swift project
#endif

#ifdef DEBUG
#define DMLog(...) NSLog(@"[VKLogin] %s %@", __PRETTY_FUNCTION__, [NSString stringWithFormat:__VA_ARGS__])
#else
#define DMLog(...) do { } while (0)
#endif

NSString *const E_NOT_INITIALIZED = @"E_NOT_INITIALIZED";
NSString *const E_VK_UNKNOWN = @"E_VK_UNKNOWN";
NSString *const E_VK_API_ERROR = @"E_VK_API_ERROR";
NSString *const E_VK_CANCELED = @"E_VK_CANCELED";
NSString *const E_VK_RESPONSE_STRING_PARSING_ERROR = @"E_VK_RESPONSE_STRING_PARSING_ERROR";
NSString *const E_VK_AUTHORIZE_CONTROLLER_CANCEL = @"E_VK_AUTHORIZE_CONTROLLER_CANCEL";
NSString *const E_VK_REQUEST_NOT_PREPARED = @"E_VK_REQUEST_NOT_PREPARED";

@implementation VkontakteManager {
  VKSdk *sdk;
  RCTPromiseResolveBlock loginResolver;
  RCTPromiseRejectBlock loginRejector;
}

- (instancetype)init
{
  if (self = [super init]) {
    NSNumber *appId = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"VK_APP_ID"];
    if (appId){
      DMLog(@"Found appId %@ on startup", appId);
      [self initialize:appId];
    }
  }
  return self;
}

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(initialize: (nonnull NSNumber *) appId) {
  DMLog(@"Initialize app id %@", appId);

  sdk = [VKSdk initializeWithAppId:[appId stringValue]];
  [sdk registerDelegate:self];
  [sdk setUiDelegate:self];
}

RCT_EXPORT_METHOD(login: (NSArray *) scope resolver: (RCTPromiseResolveBlock) resolve rejecter: (RCTPromiseRejectBlock) reject) {
  DMLog(@"Login with scope %@", scope);
  if (![VKSdk initialized]){
    reject(E_NOT_INITIALIZED, @"VK SDK must be initialized first", nil);
    return;
  }

  self->loginResolver = resolve;
  self->loginRejector = reject;
  [VKSdk wakeUpSession:scope completeBlock:^(VKAuthorizationState state, NSError *error) {
    switch (state) {
      case VKAuthorizationAuthorized: {
        DMLog(@"User already authorized");
        NSDictionary *loginData = [self getResponse];
        self->loginResolver(loginData);
        break;
      }
      case VKAuthorizationInitialized: {
        DMLog(@"Authorization required");
        [VKSdk authorize:scope];
        break;
      }
      case VKAuthorizationError: {
        NSString *errMessage = [NSString stringWithFormat:@"VK Authorization error: %@", [error localizedDescription]];
        DMLog(errMessage);
        [self rejectLoginWithError:error];
      }
    }
  }];
};

RCT_EXPORT_METHOD(isLoggedIn: (RCTPromiseResolveBlock) resolve rejecter: (RCTPromiseRejectBlock) reject) {
  if ([VKSdk initialized]){
    resolve([NSNumber numberWithBool:[VKSdk isLoggedIn]]);
  }
  else {
    reject(E_NOT_INITIALIZED, @"VK SDK must be initialized first", nil);
  }
}

RCT_REMAP_METHOD(logout, resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  DMLog(@"Logout");
  if (![VKSdk initialized]){
    reject(E_NOT_INITIALIZED, @"VK SDK must be initialized first", nil);
    return;
  }
  [VKSdk forceLogout];
  resolve(nil);
};

- (void)vkSdkAccessAuthorizationFinishedWithResult:(VKAuthorizationResult *)result {
  DMLog(@"Authorization result is %@", result);
  if (result.error && self->loginRejector != nil) {
    DMLog(@"Authrization failed with code %ld and message %ld", (long)result.error.code, (long)result.error.vkError.errorCode);
    [self rejectLoginWithError:result.error];
  } else if (result.token && self->loginResolver != nil) {
    NSDictionary *loginData = [self getResponse];
    self->loginResolver(loginData);
  }
}

- (void)vkSdkUserAuthorizationFailed:(VKError *)error {
  DMLog(@"Authrization failed with code %ld and message %@", (long)error.errorCode, error.errorMessage);
  [self rejectLoginWithVKError:error];
}

- (void)vkSdkNeedCaptchaEnter:(VKError *)captchaError {
  DMLog(@"VK SDK UI Delegate needs captcha: %@", captchaError);
  VKCaptchaViewController *vc = [VKCaptchaViewController captchaControllerWithError:captchaError];

  UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];

  [vc presentIn:root];
}

- (void)vkSdkShouldPresentViewController:(UIViewController *)controller {
  DMLog(@"Presenting view controller");
  UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];

  [root presentViewController:controller animated:YES completion:nil];
}

- (NSDictionary *)getResponse {
  VKAccessToken *token = [VKSdk accessToken];

  if (token) {
    return @{
        @"access_token" : token.accessToken,
        @"user_id" : token.userId,
        @"expires_in" : [NSNumber numberWithInt:token.expiresIn],
        @"email" : token.email ?: [NSNull null],
        @"secret" : token.secret ?: [NSNull null]
    };
  }
  else {
    return [NSNull null];
  }
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

-(void)rejectLoginWithError:(NSError*)error {
  if ([error.domain isEqualToString:VKSdkErrorDomain]) {
    [self rejectLoginWithVKError:error.vkError];
  } else {
    self->loginRejector(E_VK_UNKNOWN, error.localizedDescription, nil);
  }
}

-(void)rejectLoginWithVKError:(VKError*)vkError {
  NSString* errorCode = E_VK_UNKNOWN;
  NSString* errorMessage = vkError.errorMessage;
  switch (vkError.errorCode) {
    case VK_API_ERROR:
      errorCode = E_VK_API_ERROR;
      break;
    case VK_API_CANCELED:
      errorCode = E_VK_CANCELED;
      errorMessage = @"User canceled";
      break;
    case VK_API_REQUEST_NOT_PREPARED:
      errorCode = E_VK_REQUEST_NOT_PREPARED;
      break;
    case VK_RESPONSE_STRING_PARSING_ERROR:
      errorCode = E_VK_RESPONSE_STRING_PARSING_ERROR;
      break;
    case VK_AUTHORIZE_CONTROLLER_CANCEL:
      errorCode = E_VK_AUTHORIZE_CONTROLLER_CANCEL;
      break;
        
    default:
      errorCode = E_VK_UNKNOWN;
      break;
  }
  self->loginRejector(errorCode, errorMessage, nil);
}

@end
