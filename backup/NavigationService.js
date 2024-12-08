// import { createNavigationContainerRef } from "@react-navigation/native";

// export const navigationRef = createNavigationContainerRef();
// let initialRoute = null;

// function navigate(route) {
//     console.log(`trying to navigate to ${route}`);
//     if (navigationRef.isReady()) {
//         console.log(`navigationRef ready, navigating to ${route}`);
        
//         navigationRef.current.dispatch(someAction);
//     } else {
//         console.log(`navigation not ready, setting initialRoute: ${route}`);
//         initialRoute = route;
//     }
// }

// function goToInitialRoute() {
//     console.log(`initial route: ${initialRoute}`);
//     if (initialRoute) {
//         console.log('going to initial route');
//         navigate(initialRoute);
//     }
// }

// export default {
//     navigate,
//     goToInitialRoute,
// };