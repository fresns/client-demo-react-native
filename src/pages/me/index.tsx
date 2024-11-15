import { useFocusEffect } from "@react-navigation/native";
import { isNil } from "lodash";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useMemo, useRef } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";
import { fresnsLogin } from "../../../sdk/helpers/login";
import { rpx } from "../../../sdk/helpers/rpx";
import { ToastMessage } from "../../components/message/toast-message";
import { useSetNavigationTitle } from "../../hooks/use-set-navigation-title";
import { navigate } from "../../router/navigate";
import { ScreenName } from "../../router/screen-name";
import { useStore } from "./index.store";

const Menu = (props) => {
  return (
    <TouchableOpacity
      style={styles.menu}
      onPress={() => {
        props?.action();
      }}
    >
      <Text style={styles.menuTitle}>{props.title}</Text>
      <View style={styles.menuRight}>
        {props.remark && <Text style={styles.menuRemark}>{props.remark}</Text>}
        <View style={styles.menuArrow}></View>
      </View>
    </TouchableOpacity>
  );
};

export const Me = observer(() => {
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  initAndResetStore();
  useSetNavigationTitle(data.title);

  const actionSheet: any = useRef(null);

  const langMenus = useMemo(() => {
    if (!data.fresnsConfig?.language_menus) {
      return undefined;
    }
    const list = [{ langName: "取消" }].concat(...[data.fresnsConfig?.language_menus || []]);
    return list.map((item) => item.langName);
  }, [data.fresnsConfig]);

  useFocusEffect(
    React.useCallback(() => {
      store.onShow();

      return () => {};
    }, [])
  );

  return (
    <ScrollView>
      {data.accountLogin && !isNil(data.fresnsUser) && (
        <View style={{ padding: rpx(40), paddingTop: 0, backgroundColor: "#FFF" }}>
          <View style={{ position: "relative" }}>
            <View style={{ position: "relative", width: rpx(200), height: rpx(200), marginLeft: rpx(-40) }}>
              <Image
                source={{ uri: data.fresnsUser.decorate }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: rpx(200),
                  height: rpx(200),
                  zIndex: 100,
                }}
              />
              <Image
                source={{ uri: data.fresnsUser.avatar }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: rpx(120),
                  height: rpx(120),
                  margin: rpx(40),
                  borderRadius: rpx(120),
                  zIndex: 80,
                }}
              />
            </View>
            <View
              style={{
                position: "absolute",
                backgroundColor: "#efefef",
                borderRadius: rpx(5),
                right: 0,
                top: "50%",
                transform: [{ translateY: -rpx(20) }],
                padding: rpx(20),
                paddingTop: rpx(10),
                paddingBottom: rpx(10),
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
              onTouchEnd={() => {
                navigate(ScreenName.MeSetting);
              }}
            >
              <Text style={{ fontSize: rpx(24) }}>{data.fresnsLang?.setting}</Text>
            </View>
          </View>

          <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
            <Text style={{ fontSize: rpx(40) }}>{data.fresnsUser.nickname}</Text>
            <Image
              style={{ width: rpx(40), height: rpx(40), marginLeft: rpx(10) }}
              source={
                data.fresnsUser.verifiedIcon
                  ? { uri: data.fresnsUser.verifiedIcon }
                  : require("../../../assets/images/icon-verified.png")
              }
            />
            <Text style={{ marginLeft: rpx(10), color: "#666" }}>@{data.fresnsUser.username}</Text>
            <Text
              style={{
                color: "#999",
                fontSize: rpx(20),
                backgroundColor: "rgba(0,0,0,0.05)",
                padding: rpx(10),
                paddingTop: rpx(5),
                paddingBottom: rpx(5),
                marginLeft: rpx(10),
                borderRadius: rpx(20),
              }}
            >
              {data.fresnsUser.roleName}
            </Text>
          </View>
          <View>
            <Text style={{ marginTop: rpx(20), color: "#666", lineHeight: rpx(46), fontSize: rpx(30) }}>
              {data.fresnsUser.bio}
            </Text>
          </View>
          <View
            style={{
              marginTop: rpx(20),
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#576b95", marginRight: rpx(20) }}>
              {data.fresnsUser.stats.followUserCount} {data.fresnsLang?.userFollowing}
            </Text>
            <Text>|</Text>
            <Text style={{ marginLeft: rpx(20), color: "#576b95" }}>
              {data.fresnsUser.stats.followerCount} {data.fresnsUser.interaction.followUserTitle}
            </Text>
          </View>
        </View>
      )}

      {!data.accountLogin && (
        <View style={styles.loginContainer} onTouchEnd={() => store.onClickLogin()}>
          <View style={styles.login}>
            <Text style={styles.loginText}>{data.fresnsLang?.accountLoginOrRegister}</Text>
          </View>
        </View>
      )}

      <View style={styles.gutter}></View>
      <Menu
        title={data.fresnsLang?.search}
        action={() => {
          navigate(ScreenName.Search);
        }}
      />
      <View style={styles.gutter}></View>

      {data.accountLogin && (
        <>
          <Menu
            title={data.fresnsConfig?.publish_post_name}
            action={() => {
              ToastMessage.info({ title: "暂未实现" });
            }}
          />
          <View style={styles.menuSplite}></View>
          <Menu
            title={data.fresnsConfig?.channel_me_extcredits_name}
            action={() => {
              navigate(ScreenName.MeExtCredits);
            }}
          />
          <View style={styles.menuSplite}></View>
          <Menu
            title={data.fresnsConfig?.channel_me_wallet_name}
            remark={
              data.fresnsAccount
                ? `${data.fresnsAccount?.wallet?.currencyCode} ${data.fresnsAccount?.wallet?.balance} ${data.fresnsAccount?.wallet?.currencyUnit}`
                : undefined
            }
            action={() => {
              navigate(ScreenName.MeWallet);
            }}
          />
          <View style={styles.menuSplite}></View>
          <Menu
            title={data.fresnsConfig?.channel_me_drafts_name}
            remark={data.fresnsOverview ? data.fresnsOverview.draftCount?.posts : undefined}
            action={() => {
              navigate(ScreenName.MeDrafts);
            }}
          />
        </>
      )}

      <View style={styles.gutter}></View>
      <Menu
        title={data.fresnsLang?.switchUser}
        remark={data.fresnsAccount ? data.fresnsAccount.users?.length : undefined}
        action={() => {
          navigate(ScreenName.MeUsers);
        }}
      />
      <View style={styles.menuSplite}></View>
      <Menu
        title={data.fresnsLang?.switchLanguage}
        action={() => {
          actionSheet?.current?.show();
        }}
      />
      <View style={styles.menuSplite}></View>
      <Menu
        title={data.fresnsLang?.about}
        action={() => {
          navigate(ScreenName.PortalAbout);
        }}
      />

      {data.accountLogin && (
        <>
          <View style={styles.gutter}></View>
          <Button
            title="退出"
            onPress={() => {
              fresnsLogin.logout();
              store.reset();
            }}
          />
          <View style={styles.gutter}></View>
        </>
      )}

      {langMenus && (
        <ActionSheet
          ref={actionSheet}
          options={langMenus}
          cancelButtonIndex={0}
          destructiveButtonIndex={0}
          onPress={(index) => {
            if (index == 0) {
              return;
            }
            store.switchLangTag(data.fresnsConfig.language_menus[index - 1].langTag);
          }}
        />
      )}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  profileInfo: {
    display: "flex",
    flexDirection: "row",
  },
  gutter: {
    height: rpx(30),
  },
  menuSplite: {
    width: "100%",
    height: rpx(2),
  },
  loginContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: rpx(40),
  },
  login: {
    width: rpx(426),
    height: rpx(126),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
    borderRadius: rpx(12),
  },
  loginText: {
    color: "#FFF",
    fontSize: rpx(32),
    fontWeight: "bold",
  },
  menu: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: rpx(32),
  },
  menuRemark: {
    color: "#999",
    fontSize: rpx(28),
    marginRight: rpx(20),
  },
  menuTitle: {
    flex: 1,
    fontSize: rpx(34),
  },
  menuRight: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  menuArrow: {
    width: rpx(18),
    height: rpx(18),
    borderColor: "#999",
    borderTopWidth: rpx(4),
    borderRightWidth: rpx(4),
    transform: [{ rotate: "45deg" }],
  },
  container: {
    display: "flex",
    flexDirection: "row",
    minHeight: rpx(60),
    paddingHorizontal: rpx(20),
    paddingVertical: rpx(10),
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottomWidth: rpx(2),
    borderBottomColor: "#c5c5c5",
  },
  label: {
    width: rpx(200),
  },
  value: {
    flex: 1,
  },
  action: {
    width: rpx(150),
    textAlign: "center",
  },
});
