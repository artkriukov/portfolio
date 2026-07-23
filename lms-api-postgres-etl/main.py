import logging
from logging_setup import setup_logging

logger = logging.getLogger(__name__)

def main():
  setup_logging()
  logger.info('Setup')

if __name__ == "__main__":
  main()