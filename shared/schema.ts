import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const satellites = pgTable("satellites", {
  id: serial("id").primaryKey(),
  noradId: text("norad_id").notNull().unique(),
  name: text("name").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2").notNull(),
  epoch: timestamp("epoch").notNull(),
  meanMotion: real("mean_motion").notNull(),
  eccentricity: real("eccentricity").notNull(),
  inclination: real("inclination").notNull(),
  raan: real("raan").notNull(),
  argOfPerigee: real("arg_of_perigee").notNull(),
  meanAnomaly: real("mean_anomaly").notNull(),
  dragCoefficient: real("drag_coefficient"),
  crossSectionalArea: real("cross_sectional_area"),
  mass: real("mass"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const satellitePositions = pgTable("satellite_positions", {
  id: serial("id").primaryKey(),
  noradId: text("norad_id").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  altitude: real("altitude").notNull(),
  velocityX: real("velocity_x").notNull(),
  velocityY: real("velocity_y").notNull(),
  velocityZ: real("velocity_z").notNull(),
  accuracyEstimate: real("accuracy_estimate"),
  method: text("method").notNull().default("enhanced"),
});

export const spaceWeatherData = pgTable("space_weather_data", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  solarFlux: real("solar_flux").notNull(),
  kpIndex: real("kp_index").notNull(),
  apIndex: real("ap_index").notNull(),
  dstIndex: real("dst_index"),
  source: text("source").notNull().default("NOAA"),
});

export const validationResults = pgTable("validation_results", {
  id: serial("id").primaryKey(),
  noradId: text("norad_id").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  predictedLat: real("predicted_lat").notNull(),
  predictedLon: real("predicted_lon").notNull(),
  predictedAlt: real("predicted_alt").notNull(),
  actualLat: real("actual_lat").notNull(),
  actualLon: real("actual_lon").notNull(),
  actualAlt: real("actual_alt").notNull(),
  errorDistance: real("error_distance").notNull(),
  method: text("method").notNull(),
});

export const systemConfiguration = pgTable("system_configuration", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertSatelliteSchema = createInsertSchema(satellites).omit({
  id: true,
  lastUpdated: true,
});

export const insertPositionSchema = createInsertSchema(satellitePositions).omit({
  id: true,
});

export const insertSpaceWeatherSchema = createInsertSchema(spaceWeatherData).omit({
  id: true,
});

export const insertValidationSchema = createInsertSchema(validationResults).omit({
  id: true,
});

export const insertConfigSchema = createInsertSchema(systemConfiguration).omit({
  id: true,
  lastUpdated: true,
});

export type InsertSatellite = z.infer<typeof insertSatelliteSchema>;
export type InsertPosition = z.infer<typeof insertPositionSchema>;
export type InsertSpaceWeather = z.infer<typeof insertSpaceWeatherSchema>;
export type InsertValidation = z.infer<typeof insertValidationSchema>;
export type InsertConfig = z.infer<typeof insertConfigSchema>;

export type Satellite = typeof satellites.$inferSelect;
export type SatellitePosition = typeof satellitePositions.$inferSelect;
export type SpaceWeatherData = typeof spaceWeatherData.$inferSelect;
export type ValidationResult = typeof validationResults.$inferSelect;
export type SystemConfiguration = typeof systemConfiguration.$inferSelect;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
