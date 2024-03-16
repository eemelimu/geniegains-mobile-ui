import React, { useState, useContext, useCallback, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import { useSettings } from "../contexts/SettingsContext";
import Toast, { ErrorToast } from "react-native-toast-message";
import { hexToRgba, storeData } from "../utils/utils";
import useRequest from "../hooks/useRequest";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from "../contexts/ThemeContext";
import { BACKEND_URL } from "../assets/config";
import { useFocusEffect } from "@react-navigation/native";
import { useNotification } from "../contexts/NotificationContext";

const AccountSettings = () => {
  const { disableNotifications, enableTips } = useSettings();
  const { setError, setSuccess, startLoading, stopLoading } = useNotification();
  const { dispatch, state } = useAuth();
  const token = state.token;
  const { fetcher } = useRequest(token);
  const [username, setUsername] = useState("");
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const {
    theme: ThemeColors,
    resetTheme,
    changeThemeColor,
  } = useContext(ThemeContext);

  const logoutAll = async () => {
    setLogoutModalVisible(false);
    const res = await fetcher({
      url: BACKEND_URL + "logout",
      reqMethod: "POST",
      errorMessage: "Something went wrong",
      showLoading: true,
    });
    if (res) {
      enableTips();
      disableNotifications();
      dispatch({ type: "LOGOUT" });
      resetTheme();
      storeData("theme", ThemeColors);
    }
  };

  const getUserData = async () => {
    const res = await fetcher({
      url: BACKEND_URL + "user",
      reqMethod: "GET",
      errorMessage: "Something went wrong",
      showLoading: true,
    });
    if (res) {
      setUsername(res.username);
      setEmail(res.email);
    }
  };

  const handleEmailChange = async () => {
    const res = await fetcher({
      url: BACKEND_URL + "user",
      reqMethod: "PATCH",
      object: { email: email },
      errorMessage: "Invalid email or email already taken",
      successMessage: "Email changed successfully",
      showLoading: true,
    });
    if (res) {
      getUserData();
      setEmailModalVisible(false);
    }
  };

  const handlePasswordChange = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const res = await fetcher({
      url: BACKEND_URL + "user",
      reqMethod: "PATCH",
      object: { password: password },
      errorMessage: "Invalid password",
      successMessage: "Password changed successfully",
      showLoading: true,
    });
    if (res) {
      dispatch({ type: "LOGIN", payload: { token: res.token } });
      setPasswordModalVisible(false);
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handleLogout = () => {
    enableTips();
    setLogoutModalVisible(false);
    disableNotifications();
    dispatch({ type: "LOGOUT" });
    resetTheme();
    storeData("theme", ThemeColors);
  };

  useFocusEffect(
    useCallback(() => {
      getUserData();
    }, [])
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: ThemeColors.primary,
    },
    username: {
      fontSize: 20,
      marginBottom: 20,
      fontWeight: "bold",
      color: ThemeColors.tertiary,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    buttonText: {
      marginLeft: 10,
      color: ThemeColors.tertiary,
    },
    modalContainer: {
      flex: 1,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: hexToRgba(ThemeColors.primary, 0.8),
    },
    modalContent: {
      backgroundColor: hexToRgba(ThemeColors.secondary, 0.9),
      padding: 20,
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
    },
    input: {
      width: "100%",
      height: 40,
      borderColor: ThemeColors.quaternary,
      borderWidth: 1,
      marginBottom: 10,
      paddingLeft: 10,
    },
    saveButton: {
      backgroundColor: ThemeColors.primary,
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    saveButtonText: {
      color: ThemeColors.tertiary,
    },
    cancelButton: {
      marginTop: 10,
      padding: 5,
    },
    cancelButtonText: {
      color: ThemeColors.quaternary,
    },
    boldText: {
      fontWeight: "bold",
      color: ThemeColors.tertiary,
      fontSize: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{username}</Text>

      <Pressable
        style={styles.button}
        onPress={() => setEmailModalVisible(true)}
      >
        <MaterialIcons name="email" size={24} color={ThemeColors.tertiary} />
        <Text style={styles.buttonText}>Change Email</Text>
      </Pressable>
      {/* <Button
      width={"80%"}
        text={"Change Email"}
        onPress={() => setEmailModalVisible(true)}
        renderIcon={(color) => (
          <MaterialIcons name="email" size={24} color={color} />
        )}
      /> */}

      <Pressable
        style={styles.button}
        onPress={() => setPasswordModalVisible(true)}
      >
        <MaterialIcons name="lock" size={24} color={ThemeColors.tertiary} />
        <Text style={styles.buttonText}>Change Password</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => setLogoutModalVisible(true)}
      >
        <MaterialIcons name="logout" size={24} color={ThemeColors.tertiary} />
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={emailModalVisible}
        onRequestClose={() => {
          getUserData();
          setEmailModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder={email}
              color={ThemeColors.tertiary}
              placeholderTextColor={ThemeColors.tertiary}
            />
            <Button
              width={"80%"}
              text={"Save"}
              onPress={handleEmailChange}
              color={ThemeColors.primary}
              textColor={ThemeColors.tertiary}
            />
            <Button
              isHighlighted={true}
              width={"80%"}
              text={"Cancel"}
              onPress={() => {
                getUserData();
                setEmailModalVisible(false);
              }}
            />
          </View>
        </View>
        <Toast />
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              color={ThemeColors.tertiary}
              placeholderTextColor={ThemeColors.tertiary}
              placeholder="New Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              placeholderTextColor={ThemeColors.tertiary}
              color={ThemeColors.tertiary}
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {/* <Pressable style={styles.saveButton} onPress={handlePasswordChange}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable> */}
            <Button
              width={"80%"}
              text={"Save"}
              onPress={handlePasswordChange}
              color={ThemeColors.primary}
              textColor={ThemeColors.tertiary}
            />
            <Button
              isHighlighted={true}
              width={"80%"}
              text={"Cancel"}
              onPress={() => {
                setPasswordModalVisible(false);
                setPassword("");
                setConfirmPassword("");
              }}
            />
          </View>
        </View>
        <Toast />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.boldText}>
              Are you sure you want to logout?
            </Text>
            <Button
              width={"80%"}
              text={"Yes log me out from all devices"}
              onPress={logoutAll}
              textColor={ThemeColors.tertiary}
            />
            <Button
              width={"80%"}
              text={"Logout just from this device"}
              onPress={handleLogout}
            />
            <Button
              isHighlighted={true}
              width={"80%"}
              text={"Cancel"}
              onPress={() => setLogoutModalVisible(false)}
            />
          </View>
        </View>
        <Toast />
      </Modal>
    </View>
  );
};

export default AccountSettings;