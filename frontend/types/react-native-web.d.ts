declare module 'react-native-web' {
  import React, { CSSProperties } from 'react';

  export type ViewStyle = CSSProperties & {
    elevation?: number;
    shadowColor?: string;
    shadowOffset?: { width: number; height: number };
    shadowOpacity?: number;
    shadowRadius?: number;
  };

  export type TextStyle = ViewStyle & {
    fontSize?: number | string;
    fontWeight?: string;
    lineHeight?: number | string;
  };

  export interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
    style?: ViewStyle | (ViewStyle | undefined)[] | any;
    accessibilityLabel?: string;
  }

  export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
    style?: TextStyle | (TextStyle | undefined)[] | any;
    numberOfLines?: number;
    accessibilityLabel?: string;
  }

  export interface TouchableOpacityProps extends React.HTMLAttributes<HTMLDivElement> {
    style?: ViewStyle | (ViewStyle | undefined)[] | any;
    activeOpacity?: number;
    onPress?: (e?: any) => void;
    disabled?: boolean;
    accessibilityLabel?: string;
  }

  export interface TextInputProps {
    style?: TextStyle | (TextStyle | undefined)[] | any;
    value?: string;
    onChangeText?: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: string;
    maxLength?: number;
    placeholder?: string;
    placeholderTextColor?: string;
  }

  export interface ScrollViewProps extends React.HTMLAttributes<HTMLDivElement> {
    style?: ViewStyle | (ViewStyle | undefined)[] | any;
    contentContainerStyle?: ViewStyle | (ViewStyle | undefined)[] | any;
    horizontal?: boolean;
  }

  export interface ActivityIndicatorProps {
    size?: 'small' | 'large' | number;
    color?: string;
  }

  export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    source?: { uri: string } | string;
    style?: ViewStyle | (ViewStyle | undefined)[] | any;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
    accessibilityLabel?: string;
    alt?: string;
  }

  export const View: React.FC<ViewProps>;
  export const Text: React.FC<TextProps>;
  export const TouchableOpacity: React.FC<TouchableOpacityProps>;
  export const TextInput: React.FC<TextInputProps>;
  export const ScrollView: React.FC<ScrollViewProps>;
  export const ActivityIndicator: React.FC<ActivityIndicatorProps>;
  export const Image: React.FC<ImageProps>;
  export const StyleSheet: {
    create: <T extends Record<string, ViewStyle | TextStyle | any>>(styles: T) => T;
  };
}
