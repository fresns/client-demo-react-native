/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import React, { Component } from "react";
import { Button, Modal, StyleSheet, Text, View } from "react-native";

type ModalState = {
  visible: boolean;
  title: string | null;
  content: string | null;
};

export class ModalMessageElement extends Component<{}, ModalState> {
  static instance: React.Component | null = null;

  static show(params: { title?: string; content: string }) {
    if (ModalMessageElement.instance) {
      const { title, content } = params;
      ModalMessageElement.instance.setState({ visible: true, title, content });
    }
  }

  static hide() {
    if (ModalMessageElement.instance) {
      ModalMessageElement.instance.setState({ visible: false, title: null, content: null });
    }
  }

  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      visible: false,
      title: null,
      content: null,
    };
    ModalMessageElement.instance = this;
  }

  render() {
    return (
      <Modal transparent={true} visible={this.state.visible} onRequestClose={ModalMessageElement.hide}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>{this.state.title}</Text>
            <Text style={styles.content}>{this.state.content}</Text>
            <Button title="Close" onPress={ModalMessageElement.hide} />
          </View>
        </View>
      </Modal>
    );
  }
}

export class ModalMessage {
  static show(params: { title?: string; content: string }) {
    return ModalMessageElement.show(params);
  }

  static hide() {
    return ModalMessageElement.hide();
  }
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    marginTop: 10,
    fontSize: 16,
    marginBottom: 20,
  },
});
