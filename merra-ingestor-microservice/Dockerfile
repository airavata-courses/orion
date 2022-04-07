#
FROM python:3.8

#
WORKDIR /merra-ingestor-microservice

#
COPY ./requirements.txt /merra-ingestor-microservice/requirements.txt

#
RUN pip install netCDF4

#
RUN pip install --no-cache-dir --upgrade -r /merra-ingestor-microservice/requirements.txt

#
COPY ./merra_weather /merra-ingestor-microservice/merra_weather

#
WORKDIR ./merra_weather

#
CMD [ "python3", "manage.py", "runserver", "0.0.0.0:8000"]