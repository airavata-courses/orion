#
FROM python:3.8

#
WORKDIR /plot-weather-microservices

#
COPY ./requirements.txt /plot-weather-microservices/requirements.txt

#
RUN pip install netCDF4

#
RUN pip install geos

RUN pip install --upgrade pip setuptools wheel

RUN pip install pooch

RUN pip3 install arm_pyart==1.11.8

#
RUN pip install --no-cache-dir --upgrade -r /plot-weather-microservices/requirements.txt

#
COPY ./plot_weather /plot-weather-microservices/plot_weather

#
WORKDIR ./plot_weather

#
CMD [ "python3", "manage.py", "runserver", "0.0.0.0:8000"]