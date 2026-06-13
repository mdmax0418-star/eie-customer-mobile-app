# EIE Customer Release Submission Checklist

## Current blockers

1. Production API prerequisite is not met: `https://eie-customer-app.onrender.com/api/v1/health` returns 404. The deployed service currently responds at `/health`, but the mobile API route exists only in the backend `mobile-api-v1` branch/local working tree and is not live on Render.
2. Android release build environment is not installed on this Windows host: `JAVA_HOME` is not set and `java` is unavailable.
3. iOS IPA cannot be produced from this Windows host. A macOS runner with Xcode, CocoaPods, and Apple signing credentials is required.
4. Store submission requires account access and final approval in App Store Connect and Google Play Console.
5. Production Android signing must use a release/upload keystore, not the checked-in debug keystore. The Gradle config currently signs release with the debug key and must be updated before uploading to Google Play.
6. Privacy policy support contact/support URL/marketing URL are still placeholders and must be filled before store submission.

## Prepared artifacts

- App icon: `store-assets/app-icon-1024.png`
- Splash screens:
  - `store-assets/splash-ios-1290x2796.png`
  - `store-assets/splash-android-1080x1920.png`
  - `store-assets/splash-tablet-2048x2732.png`
- iOS AppIcon asset catalog files under `ios/EIECustomerMobileApp/Images.xcassets/AppIcon.appiconset/`
- Android launcher icons under `android/app/src/main/res/mipmap-*/`
- Store listing draft: `store-assets/store-listing.md`
- Privacy policy draft: `store-assets/privacy-policy.md`

## Required next steps

### Backend / Render

1. Merge/deploy backend branch containing `/api/v1/health` and mobile API routes to the branch Render deploys from.
2. Confirm `GET https://eie-customer-app.onrender.com/api/v1/health` returns a 2xx JSON response.
3. Smoke-test mobile endpoints:
   - `POST /api/v1/auth/login`
   - `GET /api/v1/auth/me`
   - `POST /api/v1/submissions`
   - admin-protected submission/document routes as needed.

### Android

1. Install JDK and Android SDK; set `JAVA_HOME` and `ANDROID_HOME`/`ANDROID_SDK_ROOT`.
2. Replace debug signing with Play upload key signing via environment variables or secured CI secrets.
3. Build with `cd android && ./gradlew bundleRelease`.
4. Upload generated AAB from `android/app/build/outputs/bundle/release/app-release.aab` to Google Play Console.

### iOS

1. Use macOS with Xcode and CocoaPods.
2. Run `bundle install` and `bundle exec pod install` in `ios/`.
3. Configure Bundle ID, Team, provisioning, signing, version/build number.
4. Archive in Xcode or via `xcodebuild`, export IPA, then upload with Transporter/App Store Connect.

### Store consoles

1. Fill support/contact URLs and final privacy policy URL.
2. Provide reviewer demo credentials.
3. Upload screenshots for required device classes.
4. Complete app privacy/data safety questionnaires.
5. Submit for review after user/developer-account approval.
