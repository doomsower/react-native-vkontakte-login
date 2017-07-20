require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name             = 'react-native-vkontakte-login'
  s.version          = package['version']
  s.summary          = 'A React Native module that wraps VK SDK'
  s.requires_arc = true
  s.homepage         = 'https://github.com/doomsower/react-native-vkontakte-login'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'Konstantin Kuznetsov' => 'K.Kuznetcov@gmail.com' }
  s.source           = { :git => 'https://github.com/doomsower/react-native-vkontakte-login.git', :tag => s.version.to_s }

  s.source_files = 'ios/*.{h,m}'

  s.platform     = :ios, "7.0"

  s.dependency 'VK-ios-sdk'
end
