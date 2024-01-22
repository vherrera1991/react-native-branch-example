import { useEffect, useState } from "react";
import {StatusBar} from "expo-status-bar";
import {StyleSheet, Text, View} from "react-native";
import branch from "react-native-branch";

export default function App() {

  const [msg, setMsg] = useState('');

  useEffect(() => {
    console.log('componentDidMount');

    // subscribe to branch
    const _subscription = branch.subscribe({
      onOpenStart: ({uri, cachedInitialEvent}) => {
        console.log(
          "subscribe onOpenStart, will open " +
            uri +
            " cachedInitialEvent is " +
            cachedInitialEvent
        );
      },
      onOpenComplete: ({error, params, uri}) => {
        if (error) {
          setMsg('Error!');
          console.error(
            "subscribe onOpenComplete, Error from opening uri: " +
              uri +
              " error: " +
              error
          );
          return;
        } else if (params) {
          setMsg(JSON.stringify(params));
          if (!params["+clicked_branch_link"]) {
            if (params["+non_branch_link"]) {
              console.log("non_branch_link: " + uri);
              // Route based on non-Branch links
              return;
            }
          } else {
            // Handle params
            const deepLinkPath = params.$deeplink_path;
            const canonicalUrl = params.$canonical_url;
            // Route based on Branch link data
            return;
          }
        }
      },
    });

    () => {
      console.log('componentWillUnmount');
      _subscription();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text>{msg}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
