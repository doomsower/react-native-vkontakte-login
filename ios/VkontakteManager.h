#import <React/RCTBridgeModule.h>

#if __has_include(<VKSdkFramework/VKSdkFramework.h>)
#import <VKSdkFramework/VKSdkFramework.h>
#else
#import "VKSdk.h"
#endif

@interface VkontakteManager : NSObject <RCTBridgeModule, VKSdkDelegate, VKSdkUIDelegate>
@end
