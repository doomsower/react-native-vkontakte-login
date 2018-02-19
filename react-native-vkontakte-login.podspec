require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'react-native-vkontakte-login'
  s.version      = package['version']
  s.summary      = 'A React Native module that wraps VK SDK'
  s.author       = { 'Konstantin Kuznetsov' => 'K.Kuznetcov@gmail.com' }
  s.homepage     = 'https://github.com/doomsower/react-native-vkontakte-login'
  s.license      = { :type => 'MIT', :file => 'LICENSE' }
  s.source       = { :git => 'https://github.com/doomsower/react-native-vkontakte-login.git' }

  s.platform     = :ios, "8.0"
  s.source_files = 'ios/*.{h,m}'

  s.dependency 'VK-ios-sdk'
  s.dependency 'React'
end
