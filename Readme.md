# **Description**

Android App for creating exercises / tracking workouts.

## **Testing**

Homer Simpson account is seedied with some data for testing purposes.

Login in with: 

Email: homer@simpson.com
Password: secret

## **Backend URL**

<https://myfitnesstrainer-backend.onrender.com>

## **Plugins/Resources**

- Kotlin to Json Plugin
- Material Card
- Parelize / Parcelable

## **Sources**

| Sources                                                                                                             | Reason                                                      |
| ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| <https://www.kodeco.com/books/kotlin-coroutines-by-tutorials/v2.0/chapters/5-async-await>                           | general async / await                                       |
| <https://stackoverflow.com/questions/6543811/intent-putextra-list>                                                  | putExtra - pass args - Parcelable                           |
| <https://www.youtube.com/watch?v=t6Sql3WMAnk&t=1025s>                                                               | How to use / setup retrofit                                 |
| <https://medium.com/@sribanavasi/best-practice-for-handling-api-calls-using-retrofit-in-android-studio-36fb5e53c08> | Wrap retrofit in NetworkResult object                       |
| <https://blog.devgenius.io/android-generic-recyclerview-adapter-67eb8f826cad>                                       | Setting up a generic adapter that takes a generic as a type |

## **Known Issues**

- Total Volume of sets (shows up after workout completion) value is incorrect.
- Backend is hosted on render so a first login will take some time to load - may crash the app.