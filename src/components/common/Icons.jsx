import React from 'react';
import { User, Search, ChevronRight, ChevronLeft, Check, X, Menu, Bell, Home, Users, Calendar, Inbox } from 'lucide-react';

export const IconUser = ({ size = 20, color = 'currentColor', className, style, ...rest }) => (
  <User size={size} color={color} className={className} style={style} {...rest} />
);

export const IconSearch = ({ size = 20, color = 'currentColor', className, style, ...rest }) => (
  <Search size={size} color={color} className={className} style={style} {...rest} />
);

export const IconChevronRight = ({ size = 20, color = 'currentColor', className, style, ...rest }) => (
  <ChevronRight size={size} color={color} className={className} style={style} {...rest} />
);

export const IconChevronLeft = ({ size = 20, color = 'currentColor', className, style, ...rest }) => (
  <ChevronLeft size={size} color={color} className={className} style={style} {...rest} />
);

export const IconCheck = ({ size = 20, color = 'currentColor', className, style, ...rest }) => (
  <Check size={size} color={color} className={className} style={style} {...rest} />
);

export const IconX = ({ size = 20, color = 'currentColor', className, style, ...rest }) => (
  <X size={size} color={color} className={className} style={style} {...rest} />
);

export const IconMenu = ({ size = 20, color = 'currentColor', className, style, ...rest }) => (
  <Menu size={size} color={color} className={className} style={style} {...rest} />
);

export const IconBell = ({ size = 20, color = 'currentColor', className, style, ...rest }) => (
  <Bell size={size} color={color} className={className} style={style} {...rest} />
);

// New icons used in BottomTab
export const IconHome = ({ size = 24, color = 'currentColor', className, style, ...rest }) => (
  <Home size={size} color={color} className={className} style={style} {...rest} />
);

export const IconUsers = ({ size = 24, color = 'currentColor', className, style, ...rest }) => (
  <Users size={size} color={color} className={className} style={style} {...rest} />
);

export const IconCalendar = ({ size = 24, color = 'currentColor', className, style, ...rest }) => (
  <Calendar size={size} color={color} className={className} style={style} {...rest} />
);

export const IconInbox = ({ size = 24, color = 'currentColor', className, style, ...rest }) => (
  <Inbox size={size} color={color} className={className} style={style} {...rest} />
);


