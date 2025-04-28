import { ConfigurationDetailsModel } from '../models/pg/ConfigurationDetailsModel';
import { getCustomLogger } from '../utils/Logger';

const logger = getCustomLogger('common::Repository::ConfigurationRepository');

export const loadSystemConfiguration = async () => {
  try {
    logger.info('Fetching the configurations');

    const data = await ConfigurationDetailsModel.findAll();

    for (let index = 0; index < data.length; index++) {
      const { key, value }: ConfigurationDetailsModel = data[index];

      process.env[key] = value;
    }
    logger.info('Loaded configs: ', process.env);
  } catch (error) {
    logger.error('Error while Fetching the configurations', error);
    throw error;
  }
};

export const getConfigByName = async (configName: string) => {
  try {
    return await ConfigurationDetailsModel.findOne({ where: { key: configName }, raw: true });
  } catch (error) {
    logger.error('Error while Fetching the configuration by name', error);
  }
};

export const updateConfigByName = async (configName: string, configValue: string) => {
  try {
    return await ConfigurationDetailsModel.update({ value: configValue }, { where: { key: configName } });
  } catch (error) {
    logger.error('Error while updating the configuration by name: ', error);
    throw error;
  }
};
