#
FROM python:3.8

#
WORKDIR /merra-download-microservice

#
COPY ./requirements.txt /merra-download-microservice/requirements.txt

#
RUN pip install netCDF4


#
RUN pip install --no-cache-dir --upgrade -r /merra-download-microservice/requirements.txt

#
COPY ./merra_download /merra-download-microservice/merra_download

#
WORKDIR ./merra_download

#
CMD [ "python3", "manage.py", "runserver", "0.0.0.0:8000"]