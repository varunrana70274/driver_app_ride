import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import MapboxNavigation from '@homee/react-native-mapbox-navigation';
import {useDispatch, useSelector} from 'react-redux';
import {
  DROPOFF_LATLNG,
  PICKUP_LATLNG,
  PICKUP_RIDE_STARTED,
  PICK_UP_RIDE_KEY,
  RIDE_KEY,
} from '../../redux/Types';
import Geolocation from 'react-native-geolocation-service';
import {
  SendCurrentLocationToServer,
  updateRemainingTime,
} from '../../redux/driverRide/Action';

let interval;
let sentLocation = false;
let count = 0;
const NavigationSDK = () => {
  const dispatch = useDispatch();
  let ride_key = useSelector(state => state.ride);
  let pick_up_ride = useSelector(state => state.pick_up_ride);
  const pickUp = ride_key[RIDE_KEY][PICKUP_LATLNG];
  const dropOff = ride_key[RIDE_KEY][DROPOFF_LATLNG];
  const is_ride_started = pick_up_ride[PICK_UP_RIDE_KEY][PICKUP_RIDE_STARTED];

  const [origin, setOrigin] = React.useState(null);
  const [destination, setDestination] = React.useState(null);

  React.useEffect(() => {
    if (origin) setOrigin(null);
    if (destination) setDestination(null);

    Geolocation.getCurrentPosition(async position => {
      const positionData = position.coords;
      setOrigin([positionData.longitude, positionData.latitude]);
      sentLocation = false;
    });

    if (is_ride_started)
      setDestination([dropOff?.longitude, dropOff?.latitude]);
    else setDestination([pickUp?.longitude, pickUp?.latitude]);

    return () => {
      setOrigin(null);
      setDestination(null);
    };
  }, [is_ride_started, pickUp, dropOff]);

  if (origin && destination)
    return (
      <View style={styles.container}>
        <MapboxNavigation
          origin={origin}
          destination={destination}
          onLocationChange={event => {
            const {latitude, longitude} = event.nativeEvent;
          }}
          onRouteProgressChange={event => {
            const {
              distanceTraveled,
              durationRemaining,
              fractionTraveled,
              distanceRemaining,
            } = event.nativeEvent;
            dispatch(updateRemainingTime(durationRemaining / 60));
            if (!sentLocation) {
              sentLocation = true;
              interval = setInterval(() => {
                if (count < 11) {
                  count = count + 1;
                  dispatch(
                    SendCurrentLocationToServer(
                      origin[1],
                      origin[0],
                      null,
                      durationRemaining / 60,
                    ),
                  );
                } else {
                  clearInterval(interval);
                  count = 0;
                }
              }, 1000);
            }
          }}
          onError={event => {
            const {message} = event.nativeEvent;
            console.log('MapboxNavigation error message==>', message);
          }}
          onCancelNavigation={() => {
            // User tapped the "X" cancel button in the nav UI
            // or canceled via the OS system tray on android.
            // Do whatever you need to here.
          }}
          onArrive={() => {
            // Called when you arrive at the destination.
          }}
        />
      </View>
    );
  return null;
};
export default React.memo(NavigationSDK);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
