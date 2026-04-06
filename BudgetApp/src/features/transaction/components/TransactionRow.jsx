// src/features/transaction/components/TransactionRow.jsx
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  Image,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native";
import { amountColor, amountSign, badgeStyle } from "../utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import C from "../../../constants/colors";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const BOTTOM_NAV_HEIGHT = 80; // adjust if your tab bar is taller/shorter
const MENU_HEIGHT = 210; // approximate rendered height of the context menu
const SAFE_BOTTOM = SCREEN_HEIGHT - BOTTOM_NAV_HEIGHT - 16;

export default function TransactionRow({
  item,
  isFirst,
  isLast,
  onEdit,
  onDelete,
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(1)).current;
  const imgAnim = useRef(new Animated.Value(0)).current;

  const [menuVisible, setMenuVisible] = useState(false);
  const [attachmentVisible, setAttachmentVisible] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [menuFlipped, setMenuFlipped] = useState(false); // true = opened above

  const dotRef = useRef(null);

  const hasAttachment = !!item.attachmentUrl;

  // ── mount fade ────────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, []);

  // ── menu spring ───────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.spring(menuAnim, {
      toValue: menuVisible ? 1 : 0,
      useNativeDriver: true,
      tension: 90,
      friction: 11,
    }).start();
  }, [menuVisible]);

  // ── image viewer fade ─────────────────────────────────────────────────────
  useEffect(() => {
    if (attachmentVisible) {
      setImgLoading(true);
      setImgError(false);
      Animated.timing(imgAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else {
      imgAnim.setValue(0);
    }
  }, [attachmentVisible]);

  // ── open menu ─────────────────────────────────────────────────────────────
  const openMenu = () => {
    dotRef.current?.measure((_x, _y, _w, h, _px, pageY) => {
      const spaceBelow = SAFE_BOTTOM - (pageY + h + 4);
      let top;
      let flipped;

      if (spaceBelow >= MENU_HEIGHT) {
        // Enough room below — open downward
        top = pageY + h + 4;
        flipped = false;
      } else {
        // Not enough room — flip upward above the button
        top = pageY - MENU_HEIGHT - 4;
        flipped = true;
      }

      setMenuPos({ top, right: 16 });
      setMenuFlipped(flipped);
      setMenuVisible(true);

      Animated.sequence([
        Animated.timing(dotAnim, {
          toValue: 0.8,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const closeMenu = () => setMenuVisible(false);

  const badge = badgeStyle(item.type);
  const borderTopRadius = isFirst ? 18 : 0;
  const borderBotRadius = isLast ? 18 : 0;

  return (
    <>
      {/* ── Row ─────────────────────────────────────────────────────────────── */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          overflow: "hidden",
          borderTopLeftRadius: borderTopRadius,
          borderTopRightRadius: borderTopRadius,
          borderBottomLeftRadius: borderBotRadius,
          borderBottomRightRadius: borderBotRadius,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 13,
            paddingLeft: 14,
            paddingRight: 8,
            borderBottomWidth: isLast ? 0 : 1,
            borderBottomColor: C.border,
            backgroundColor: C.white,
            borderTopLeftRadius: borderTopRadius,
            borderTopRightRadius: borderTopRadius,
            borderBottomLeftRadius: borderBotRadius,
            borderBottomRightRadius: borderBotRadius,
          }}
        >
          {/* Category icon */}
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              backgroundColor: item.iconBg,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons name={item.icon} size={21} color={item.iconColor} />
          </View>

          {/* Text block */}
          <View style={{ flex: 1, marginRight: 4 }}>
            <Text
              style={{ fontSize: 14, fontWeight: "600", color: C.dark }}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
              {item.subtitle}
            </Text>

            {/* Time row + badges */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginTop: 2,
                flexWrap: "wrap",
              }}
            >
              <Text style={{ fontSize: 10, color: C.faint }}>{item.time}</Text>

              {/* Edited badge */}
              {item.isEdited && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "#f5f3ff",
                    paddingHorizontal: 5,
                    paddingVertical: 1,
                    borderRadius: 5,
                  }}
                >
                  <Ionicons name="create-outline" size={8} color="#7c3aed" />
                  <Text
                    style={{ fontSize: 8, color: "#7c3aed", fontWeight: "600" }}
                  >
                    edited
                  </Text>
                </View>
              )}

              {/* Attachment indicator */}
              {hasAttachment && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "#f0fdf4",
                    paddingHorizontal: 5,
                    paddingVertical: 1,
                    borderRadius: 5,
                  }}
                >
                  <Ionicons name="attach-outline" size={8} color="#16a34a" />
                  <Text
                    style={{ fontSize: 8, color: "#16a34a", fontWeight: "600" }}
                  >
                    receipt
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Amount + type badge */}
          <View style={{ alignItems: "flex-end", marginRight: 4 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: amountColor(item.type),
              }}
            >
              {amountSign(item.type)}₹
              {parseFloat(item.amount).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </Text>
            <View
              style={{
                marginTop: 5,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
                backgroundColor: badge.bg,
              }}
            >
              <Text
                style={{ fontSize: 9, fontWeight: "700", color: badge.color }}
              >
                {badge.label}
              </Text>
            </View>
          </View>

          {/* ⋮ button */}
          <Animated.View
            ref={dotRef}
            style={{ transform: [{ scale: dotAnim }] }}
          >
            <TouchableOpacity
              onPress={openMenu}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: menuVisible ? "#f3f0ff" : "#f9fafb",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={16}
                color={menuVisible ? "#7c3aed" : "#9ca3af"}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>

      {/* ── Context menu modal ───────────────────────────────────────────────── */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeMenu}
      >
        <Pressable
          onPress={closeMenu}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)" }}
        >
          <Animated.View
            style={{
              position: "absolute",
              top: menuPos.top,
              right: menuPos.right,
              width: 200,
              backgroundColor: "#fff",
              borderRadius: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.12,
              shadowRadius: 20,
              elevation: 12,
              overflow: "hidden",
              opacity: menuAnim,
              transform: [
                {
                  scale: menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.88, 1],
                  }),
                },
                {
                  // Slide in from correct direction based on flip state
                  translateY: menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [menuFlipped ? 6 : -6, 0],
                  }),
                },
              ],
            }}
          >
            {/* Header */}
            <View
              style={{
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#f3f4f6",
                backgroundColor: "#fafafa",
              }}
            >
              <Text
                style={{ fontSize: 11, fontWeight: "700", color: "#111827" }}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>
                ₹
                {parseFloat(item.amount).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>

            {/* View Attachment */}
            <TouchableOpacity
              onPress={() => {
                closeMenu();
                setAttachmentVisible(true);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 14,
                paddingVertical: 13,
                borderBottomWidth: 1,
                borderBottomColor: "#f3f4f6",
                opacity: hasAttachment ? 1 : 0.45,
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: hasAttachment ? "#f0fdf4" : "#f3f4f6",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="image-outline"
                  size={16}
                  color={hasAttachment ? "#16a34a" : "#9ca3af"}
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: hasAttachment ? "#111827" : "#9ca3af",
                  }}
                >
                  View Receipt
                </Text>
                <Text style={{ fontSize: 10, color: "#9ca3af" }}>
                  {hasAttachment ? "Tap to open image" : "No receipt uploaded"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Edit */}
            <TouchableOpacity
              onPress={() => {
                closeMenu();
                onEdit?.(item);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 14,
                paddingVertical: 13,
                borderBottomWidth: 1,
                borderBottomColor: "#f3f4f6",
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: "#ede9fe",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="pencil-outline" size={16} color="#7c3aed" />
              </View>
              <View>
                <Text
                  style={{ fontSize: 13, fontWeight: "700", color: "#111827" }}
                >
                  Edit
                </Text>
                <Text style={{ fontSize: 10, color: "#9ca3af" }}>
                  Modify transaction
                </Text>
              </View>
            </TouchableOpacity>

            {/* Delete */}
            <TouchableOpacity
              onPress={() => {
                closeMenu();
                onDelete?.(item);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 14,
                paddingVertical: 13,
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: "#fee2e2",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
              </View>
              <View>
                <Text
                  style={{ fontSize: 13, fontWeight: "700", color: "#ef4444" }}
                >
                  Delete
                </Text>
                <Text style={{ fontSize: 10, color: "#9ca3af" }}>
                  Remove permanently
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* ── Attachment / Image viewer modal ─────────────────────────────────── */}
      <Modal
        visible={attachmentVisible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => setAttachmentVisible(false)}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.92)",
            alignItems: "center",
            justifyContent: "center",
            opacity: imgAnim,
          }}
        >
          {/* Close button */}
          <TouchableOpacity
            onPress={() => setAttachmentVisible(false)}
            style={{
              position: "absolute",
              top: 52,
              right: 20,
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: "rgba(255,255,255,0.15)",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Title bar */}
          <View
            style={{
              position: "absolute",
              top: 52,
              left: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: "rgba(255,255,255,0.15)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="receipt-outline" size={16} color="#fff" />
            </View>
            <View>
              <Text
                style={{ fontSize: 13, fontWeight: "700", color: "#fff" }}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>
                Receipt / Attachment
              </Text>
            </View>
          </View>

          {/* Image or empty state */}
          {hasAttachment ? (
            <View
              style={{
                width: SCREEN_WIDTH,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {imgLoading && !imgError && (
                <ActivityIndicator
                  size="large"
                  color="#7c3aed"
                  style={{ position: "absolute" }}
                />
              )}

              {imgError && (
                <View style={{ alignItems: "center", gap: 10 }}>
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 20,
                      backgroundColor: "rgba(255,255,255,0.1)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="image-outline"
                      size={30}
                      color="rgba(255,255,255,0.4)"
                    />
                  </View>
                  <Text
                    style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}
                  >
                    Could not load image
                  </Text>
                </View>
              )}

              {!imgError && (
                <Image
                  source={{ uri: item.attachmentUrl }}
                  style={{
                    width: SCREEN_WIDTH - 32,
                    height: SCREEN_HEIGHT * 0.6,
                    borderRadius: 16,
                    opacity: imgLoading ? 0 : 1,
                  }}
                  resizeMode="contain"
                  onLoad={() => setImgLoading(false)}
                  onError={() => {
                    setImgLoading(false);
                    setImgError(true);
                  }}
                />
              )}
            </View>
          ) : (
            <View
              style={{ alignItems: "center", gap: 14, paddingHorizontal: 40 }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 24,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="image-outline"
                  size={36}
                  color="rgba(255,255,255,0.3)"
                />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                No Receipt Uploaded
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.45)",
                  textAlign: "center",
                  lineHeight: 20,
                }}
              >
                Edit this transaction to attach a receipt or document.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setAttachmentVisible(false);
                  onEdit?.(item);
                }}
                style={{
                  marginTop: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: "#7c3aed",
                  paddingHorizontal: 20,
                  paddingVertical: 11,
                  borderRadius: 12,
                }}
              >
                <Ionicons name="attach-outline" size={16} color="#fff" />
                <Text
                  style={{ fontSize: 13, fontWeight: "700", color: "#fff" }}
                >
                  Add Receipt
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Modal>
    </>
  );
}
